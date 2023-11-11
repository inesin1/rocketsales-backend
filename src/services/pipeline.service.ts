import {Injectable} from "@nestjs/common";
import {Status} from "../types/Status";

@Injectable()
export class PipelineService {
    // Возвращает статус по id в указанной воронке
    async getStatus(pipelineId: number, statusId: number): Promise<Status | void> {
        return fetch(
            `${this.apiURL}/leads/pipelines/${pipelineId}/statuses/${statusId}`,
            {
                headers: {
                    Authorization: `${this.authData.token_type} ${this.authData.access_token}`,
                }
            }
        )
            .then(res => res.json())
            .then(data => {
                return {
                    id: data.id,
                    name: data.name,
                    color: data.color
                }
            })
            .catch(e => console.log(e));
    }
}