import { parseSbom, toCsv, SUPPORTED } from "../sbom";

// ─── 샘플 픽스처 ───

const cycloneDx = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    metadata: { component: { name: "my-appliance", version: "2.1.0" } },
    components: [
      {
        type: "library",
        name: "openssl",
        version: "3.0.2",
        purl: "pkg:deb/ubuntu/openssl@3.0.2",
        licenses: [{ license: { id: "Apache-2.0" } }],
        supplier: { name: "Canonical" },
      },
      {
        type: "library",
        name: "zlib",
        version: "1.2.11",
        purl: "pkg:deb/ubuntu/zlib@1.2.11",
        licenses: [{ expression: "Zlib OR MIT" }],
        publisher: "Ubuntu",
      },
      {
        type: "operating-system",
        name: "ubuntu",
        version: "22.04",
        // 라이선스·purl 없음 → 미기재 집계 대상
      },
    ],
    ...over,
  });

const spdx = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    spdxVersion: "SPDX-2.3",
    name: "my-appliance-sbom",
    packages: [
      {
        name: "openssl",
        versionInfo: "3.0.2",
        licenseConcluded: "Apache-2.0",
        supplier: "Organization: Canonical Ltd.",
        primaryPackagePurpose: "LIBRARY",
        externalRefs: [
          {
            referenceCategory: "PACKAGE-MANAGER",
            referenceType: "purl",
            referenceLocator: "pkg:deb/ubuntu/openssl@3.0.2",
          },
        ],
      },
      {
        name: "internal-lib",
        versionInfo: "NOASSERTION",
        licenseConcluded: "NOASSERTION",
        licenseDeclared: "NONE",
        supplier: "NOASSERTION",
      },
    ],
    ...over,
  });

// ─── 형식 감지 + 기본 파싱 ───

describe("parseSbom — CycloneDX", () => {
  test("형식·버전·문서명을 인식한다", () => {
    const r = parseSbom(cycloneDx());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.format).toBe("cyclonedx");
    expect(r.specVersion).toBe("1.5");
    expect(r.documentName).toBe("my-appliance");
  });

  test("컴포넌트 필드를 매핑한다", () => {
    const r = parseSbom(cycloneDx());
    if (!r.ok) throw new Error("파싱 실패");
    const openssl = r.components.find((c) => c.name === "openssl")!;
    expect(openssl).toMatchObject({
      name: "openssl",
      version: "3.0.2",
      purl: "pkg:deb/ubuntu/openssl@3.0.2",
      license: "Apache-2.0",
      supplier: "Canonical",
      type: "library",
    });
  });

  test("라이선스 3형태를 모두 읽는다 — license.id / expression / 미기재", () => {
    const r = parseSbom(cycloneDx());
    if (!r.ok) throw new Error("파싱 실패");
    const byName = Object.fromEntries(r.components.map((c) => [c.name, c.license]));
    expect(byName["openssl"]).toBe("Apache-2.0");
    expect(byName["zlib"]).toBe("Zlib OR MIT");
    expect(byName["ubuntu"]).toBeNull();
  });

  test("license.name 형태도 읽는다", () => {
    const r = parseSbom(
      cycloneDx({
        components: [
          { type: "library", name: "custom", licenses: [{ license: { name: "Proprietary EULA" } }] },
        ],
      }),
    );
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components[0].license).toBe("Proprietary EULA");
  });

  test("publisher 를 supplier 폴백으로 쓴다", () => {
    const r = parseSbom(cycloneDx());
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components.find((c) => c.name === "zlib")!.supplier).toBe("Ubuntu");
  });

  test("중첩된 components 를 평탄화한다", () => {
    const r = parseSbom(
      cycloneDx({
        components: [
          {
            type: "application",
            name: "parent",
            version: "1.0",
            components: [
              { type: "library", name: "child-a", version: "0.1" },
              {
                type: "library",
                name: "child-b",
                version: "0.2",
                components: [{ type: "library", name: "grandchild", version: "0.3" }],
              },
            ],
          },
        ],
      }),
    );
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components.map((c) => c.name).sort()).toEqual([
      "child-a",
      "child-b",
      "grandchild",
      "parent",
    ]);
  });
});

describe("parseSbom — SPDX", () => {
  test("형식·버전·문서명을 인식한다", () => {
    const r = parseSbom(spdx());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.format).toBe("spdx");
    expect(r.specVersion).toBe("SPDX-2.3");
    expect(r.documentName).toBe("my-appliance-sbom");
  });

  test("externalRefs 에서 purl 을 뽑는다", () => {
    const r = parseSbom(spdx());
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components[0].purl).toBe("pkg:deb/ubuntu/openssl@3.0.2");
  });

  test("supplier 의 'Organization:' 접두사를 제거한다", () => {
    const r = parseSbom(spdx());
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components[0].supplier).toBe("Canonical Ltd.");
  });

  test("NOASSERTION·NONE 은 미기재(null)로 처리한다", () => {
    const r = parseSbom(spdx());
    if (!r.ok) throw new Error("파싱 실패");
    const lib = r.components[1];
    expect(lib.version).toBeNull();
    expect(lib.license).toBeNull();
    expect(lib.supplier).toBeNull();
  });

  test("licenseConcluded 가 없으면 licenseDeclared 로 폴백한다", () => {
    const r = parseSbom(
      spdx({ packages: [{ name: "x", licenseDeclared: "MIT" }] }),
    );
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components[0].license).toBe("MIT");
  });

  test("primaryPackagePurpose 를 소문자 타입으로 매핑한다", () => {
    const r = parseSbom(spdx());
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components[0].type).toBe("library");
  });
});

// ─── 통계 ───

describe("통계", () => {
  test("총계·미기재 건수를 센다", () => {
    const r = parseSbom(cycloneDx());
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.stats.total).toBe(3);
    expect(r.stats.licenseUnknown).toBe(1);
    expect(r.stats.versionUnknown).toBe(0);
  });

  test("라이선스 분포를 건수 내림차순으로 준다", () => {
    const r = parseSbom(
      cycloneDx({
        components: [
          { name: "a", licenses: [{ license: { id: "MIT" } }] },
          { name: "b", licenses: [{ license: { id: "MIT" } }] },
          { name: "c", licenses: [{ license: { id: "Apache-2.0" } }] },
          { name: "d" },
        ],
      }),
    );
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.stats.licenses[0]).toEqual({ name: "MIT", count: 2 });
    expect(r.stats.licenses).toContainEqual({ name: "Apache-2.0", count: 1 });
    expect(r.stats.licenseUnknown).toBe(1);
  });

  test("타입 분포를 센다", () => {
    const r = parseSbom(cycloneDx());
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.stats.types).toContainEqual({ name: "library", count: 2 });
    expect(r.stats.types).toContainEqual({ name: "operating-system", count: 1 });
  });
});

// ─── 에러 처리 ───

describe("에러 처리 — 조용히 실패하지 않는다", () => {
  test("깨진 JSON 은 위치를 알려준다", () => {
    const r = parseSbom('{"bomFormat": "CycloneDX", ');
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("invalid-json");
    expect(r.message.ko).toBeTruthy();
    expect(r.message.en).toBeTruthy();
    expect(r.detail).toBeTruthy();
  });

  test("빈 입력", () => {
    const r = parseSbom("   ");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("empty");
  });

  test("SBOM 이 아닌 JSON 은 형식 불명", () => {
    const r = parseSbom('{"hello": "world"}');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("unknown-format");
  });

  test("CycloneDX 미지원 버전은 명시적으로 거부한다", () => {
    const r = parseSbom(cycloneDx({ specVersion: "1.1" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("unsupported-version");
    expect(r.message.ko).toContain("1.1");
    expect(r.message.ko).toContain(SUPPORTED.cyclonedx.join(", "));
  });

  test("SPDX 3.0 은 구조가 달라 거부한다", () => {
    const r = parseSbom(JSON.stringify({ spdxVersion: "SPDX-3.0", packages: [] }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("unsupported-version");
    expect(r.message.ko).toContain("3.0");
  });

  test("컴포넌트가 0개면 알려준다", () => {
    const r = parseSbom(cycloneDx({ components: [] }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("no-components");
  });

  test("이름 없는 항목은 건너뛰되 나머지는 살린다", () => {
    const r = parseSbom(
      cycloneDx({ components: [{ type: "library" }, { name: "ok", version: "1" }] }),
    );
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.components).toHaveLength(1);
    expect(r.components[0].name).toBe("ok");
  });

  test("JSON 최상위가 배열이면 형식 불명", () => {
    const r = parseSbom("[1,2,3]");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("unknown-format");
  });
});

// ─── 대용량 ───

describe("대용량", () => {
  test("컴포넌트 20,000개를 파싱한다", () => {
    const many = Array.from({ length: 20000 }, (_, i) => ({
      type: "library",
      name: `pkg-${i}`,
      version: `1.0.${i}`,
      purl: `pkg:deb/ubuntu/pkg-${i}@1.0.${i}`,
      licenses: [{ license: { id: i % 2 ? "MIT" : "Apache-2.0" } }],
    }));
    const r = parseSbom(cycloneDx({ components: many }));
    if (!r.ok) throw new Error("파싱 실패");
    expect(r.stats.total).toBe(20000);
    expect(r.stats.licenses).toHaveLength(2);
  });
});

// ─── CSV ───

describe("toCsv", () => {
  test("헤더 + 행을 만든다", () => {
    const r = parseSbom(cycloneDx());
    if (!r.ok) throw new Error("파싱 실패");
    const lines = toCsv(r.components).trim().split("\n");
    expect(lines[0]).toBe("name,version,purl,license,supplier,type");
    expect(lines).toHaveLength(4);
    expect(lines[1]).toContain("openssl");
  });

  test("쉼표·따옴표·줄바꿈이 든 값을 이스케이프한다", () => {
    const csv = toCsv([
      {
        name: 'we"ird, name',
        version: "1\n2",
        purl: null,
        license: null,
        supplier: null,
        type: null,
      },
    ]);
    const body = csv.trim().split("\n").slice(1).join("\n");
    expect(body).toContain('"we""ird, name"');
    expect(body).toContain('"1\n2"');
  });

  test("null 은 빈 칸으로 쓴다", () => {
    const csv = toCsv([
      { name: "x", version: null, purl: null, license: null, supplier: null, type: null },
    ]);
    expect(csv.trim().split("\n")[1]).toBe("x,,,,,");
  });
});
