import { type DBSchema, type IDBPDatabase } from 'idb';
interface TourStateDb extends DBSchema {
    tours: {
        key: string;
        value: {
            isActive: boolean;
            uniqueId: string;
        };
    };
}
declare class DataRequest {
    private apiKey;
    private apiPath;
    private properties?;
    tourStateDb?: IDBPDatabase<TourStateDb>;
    constructor(apiKey?: string, apiPath?: string, properties?: {
        [key: string]: unknown;
    });
    /**
     * Gets a list of the state for all the tours associated with a given apiKey
     */
    getTourState(): Promise<void>;
    /**
     * Send events to the ShepherdPro API
     * @param body The data to send for the event
     */
    sendEvents(body: {
        data: Record<string, unknown>;
    }): Promise<Record<string, unknown>>;
}
export default DataRequest;
//# sourceMappingURL=datarequest.d.ts.map