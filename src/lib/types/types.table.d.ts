/**
     * @description
     * Column configuration object
     */
export type Column = {
    id: string;
    label: string;
    width?: string;
    flex?: number;
    grow?: number | boolean;
    sortable?: boolean;
};

/**
 * @description
 * Row data object
 */
export type Row = {
    id: string;
    [key: string]: any;
};