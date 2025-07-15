import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await axios.get<T>(url);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw new Error('This is an adapter error - Check log'); // <--- TypeScript ya no se queja
        }
    }


    post(url: string, body: any, headers?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}