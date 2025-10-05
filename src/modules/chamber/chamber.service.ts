import { Injectable } from "@nestjs/common";
import { ChamberClient } from "./chamber.client";

@Injectable()
export class ChamberService {
    constructor(private readonly client: ChamberClient) { }

    async getDeputies() {
        const deputiesResponse = await this.client.get('/deputados');
        return deputiesResponse;
    }

    async getDeputieInfo(params: { id: string }) {
        const deputiePayload = await this.client.get(`/deputados/${params.id}`)
        return deputiePayload;
    }
}