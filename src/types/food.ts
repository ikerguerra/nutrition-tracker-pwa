// TypeScript type definitions for the Nutrition Tracker API

export interface NutritionalInfo {
    id?: number;
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fats?: number;
    fiber?: number;
    sugars?: number;
    saturatedFats?: number;
    sodium?: number;
    calcium?: number;
    iron?: number;
    potassium?: number;
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminB12?: number;
}

export interface Food {
    id?: number;
    name: string;
    brand?: string;
    barcode?: string;
    servingSize?: number;
    servingUnit?: string;
    nutritionalInfo?: NutritionalInfo;
    createdAt?: string;
    updatedAt?: string;
}

export interface FoodRequest {
    name: string;
    brand?: string;
    barcode?: string;
    servingSize?: number;
    servingUnit?: string;
    nutritionalInfo: Partial<NutritionalInfo>;
}

export interface Page<T> {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface BarcodeSearchResponse {
    foundInDatabase: boolean;
    source: 'local' | 'openfoodfacts' | 'none';
    food?: Food;
    message?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    validationErrors?: Record<string, string>;
}
