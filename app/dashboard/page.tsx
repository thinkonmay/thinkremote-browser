import 'server-only'

export const revalidate = 0;
//import { useEffect, useState } from "react";
//import { useRouter, usePathname } from "next/navigation";
import VirtualOSBrowserCore from "../../supabase";
//import { MediaDevices } from "../../supabase/media";
//import { Hardware } from "../../supabase/hardware";
import { WorkerProfile, WorkerSession } from "../../supabase/type";
import { WorkerComponent, WorkerProfileWithSession } from "../../components/worker/worker";
import { WorkerSessionComponent } from "../../components/worker/session";
import RenderWorkers from "./renderWorkers";
import { createServerClient } from "../../supabase/supabase-server";
import { FetchAuthorizedWorkers } from "../../supabase/supabase-queries";
import { redirect } from 'next/navigation';
import { FetchResponse } from '../../supabase/hardware';
import { Suspense } from 'react';




function DashBoard() {
	return (
		<>
			<div
			>
				<div
					style={{
						borderRadius: '8px',
						padding: '30px',
						boxShadow: '0px 0px 15px -6px rgba(0,0,0,0.49)',
						marginBottom: '20px'
					}}
				>
					<h2>Your devices</h2>
					<Suspense fallback={<h1>Loadingg..</h1>}>
						{/* @ts-expect-error Async Server Component */}
						<RenderWorkers isRenderWorkersActive={true} />
					</Suspense>
				</div>
				<div
					style={{
						borderRadius: '8px',
						padding: '30px',
						boxShadow: '0px 0px 15px -6px rgba(0,0,0,0.49)',
						marginBottom: '20px'
					}}
				>
					<h2>Available devices</h2>

					<Suspense fallback={<h2>Loading...</h2>}>
						{/* @ts-expect-error Async Server Component */}
						<RenderWorkers isRenderWorkersActive={false} />
					</Suspense>
				</div>

			</div>
		</>
	);
}



export default DashBoard;