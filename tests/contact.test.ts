import { describe, it, expect } from "vitest";
import { getMapsHref, parseAddressListValue } from "@/lib/content/contact";

describe("parseAddressListValue", () => {
  it("parses name, address, phone and mapsUrl", () => {
    const raw = JSON.stringify([
      {
        name: "Showroom",
        address: "Montevideo 536 1A, Capital Federal",
        phone: "4371-3478",
        mapsUrl: "maps.app.goo.gl/abc",
      },
    ]);
    expect(parseAddressListValue(raw)).toEqual([
      {
        name: "Showroom",
        address: "Montevideo 536 1A, Capital Federal",
        phone: "4371-3478",
        mapsUrl: "https://maps.app.goo.gl/abc",
      },
    ]);
  });

  it("defaults missing name/mapsUrl for legacy {address, phone} entries", () => {
    const raw = '[{"address":"C. Bartolomé Mitre 2315","phone":""}]';
    expect(parseAddressListValue(raw)).toEqual([
      { name: "", address: "C. Bartolomé Mitre 2315", phone: "", mapsUrl: "" },
    ]);
  });

  it("wraps legacy plain strings", () => {
    expect(parseAddressListValue('["Montevideo 536"]')).toEqual([
      { name: "", address: "Montevideo 536", phone: "", mapsUrl: "" },
    ]);
  });

  it("drops entries without address and survives bad JSON", () => {
    expect(parseAddressListValue('[{"name":"X","address":" "}]')).toEqual([]);
    expect(parseAddressListValue("not json")).toEqual([]);
  });
});

describe("getMapsHref", () => {
  it("uses the explicit mapsUrl when present", () => {
    expect(
      getMapsHref({
        name: "",
        address: "Montevideo 536",
        phone: "",
        mapsUrl: "https://maps.app.goo.gl/abc",
      }),
    ).toBe("https://maps.app.goo.gl/abc");
  });

  it("falls back to a Google Maps search for the address", () => {
    expect(
      getMapsHref({
        name: "",
        address: "C. Bartolomé Mitre 2315",
        phone: "",
        mapsUrl: "",
      }),
    ).toBe(
      "https://www.google.com/maps/search/?api=1&query=C.%20Bartolom%C3%A9%20Mitre%202315",
    );
  });
});
