declare function myPlugin(): {
    name: string;
    resolveId(id: any): string | undefined;
    load(id: any): "export const msg = \"from virtual module\"" | undefined;
};

export { myPlugin as default };
