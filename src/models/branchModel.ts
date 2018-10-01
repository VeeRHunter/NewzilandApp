export class BranchModel {
    public branchId: number;
    public defaultStoreId: number;
    public branchCode: string;
    public branchName: string;
    public isHeadOfficeBranch: boolean;
    public isActive: boolean;
    public minExpectedMargin: number;
    public maxExpectedMargin: number;
    public contact: string;
    public emailAddress: string;
    public branchType: BranchTypeModel;
    public nonSpecialBranch?: BranchModel;
}

export class BranchTypeModel {
    public branchTypeId: number;
    public branchTypeCode: string;
    public branchTypeName: string;
    public isSpecialPriceType: boolean;
    public isQuotationType: boolean;
    public isConsignmentType: boolean;
    public isLoanStockType: boolean;
    public isNormalDepotType: boolean;
    public isProductionLineType: boolean;
}