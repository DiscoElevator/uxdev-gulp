import ModuleA from "../src/js/moduleA";

describe("ModuleA", () => {
	it("should multiply", () => {
		expect(ModuleA.multiply(2, 2)).toBe(4);
	});
});