//"use client"

import ContainerWorkers from "../../components/worker/containerWorkes"
import { FetchResponse } from "../../supabase/hardware"
import { FetchAuthorizedWorkers } from "../../supabase/supabase-queries"
import { createServerClient } from "../../supabase/supabase-server"
import {WorkerProfile} from "../../supabase/type"
interface Props {
	isRenderWorkersActive : boolean
}
const fetchWokers = async (isWorkersActive): Promise<WorkerProfile[]> => {


	const supabase = createServerClient()
	const workers = await FetchAuthorizedWorkers(supabase)
	if (workers instanceof Error) {
		console.log(workers.message)
		return
	}
	if(isWorkersActive){
		return workers.active
	}
	return workers.unactive

}
async function RenderWorkers(props: Props) {
	const {isRenderWorkersActive} = props
	const data = await fetchWokers(isRenderWorkersActive)
	return (
		<ContainerWorkers data={data} ></ContainerWorkers>
	);
}

export default RenderWorkers;