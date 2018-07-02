export interface Bean {
    getTable(): string;
    getId(): number;
    getGranteerole(): string;
    setGranteerole(r: string);
    getDisplayString(): string;
    // getSortString(): string;
}