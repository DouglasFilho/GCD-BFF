import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CHAMBER_API_BASE } from "./chamber.constants";

@Injectable()
export class ChamberClient {
    constructor(private readonly http: HttpService) { }

    async get<T>(path: string, params?: Record<string, any>): Promise<T> {
        try {
            const response = await this.http.axiosRef.get<T>(`${CHAMBER_API_BASE}${path}`, { params });
            return response.data;
        } catch (error) {
            throw new HttpException(
                error?.response?.data || "Error accessing external service",
                error?.response?.status || HttpStatus.BAD_GATEWAY,
            );
        }
    }
}