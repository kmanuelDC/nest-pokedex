export interface HttpAdapter {
    get<T>(url: string): Promise<T>;
    post(url: string, body: any, headers?: any): Promise<any>;
}