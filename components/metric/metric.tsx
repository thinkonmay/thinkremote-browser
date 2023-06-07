import React from 'react';
import styled,  { keyframes }  from 'styled-components'
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { faker } from '@faker-js/faker';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Value } from 'sass';
import { blue } from '@mui/material/colors';

export interface Data{
	key: number,
	value: number
}

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
		},
	},
};




const Metric = (props: {
		receiveFPS: Data[]
		decodeFPS: Data[]
		packetLoss: Data[]
		bandwidth: Data[]
		buffer: Data[]
		videoConnect: 'loading' | 'connect' | 'disconnect' | string
		audioConnect: 'loading' | 'connect' | 'disconnect' | string
	}) => {
	const [isOpen, setOpen] = React.useState(false)

	const data = [{
		labels: props.receiveFPS.map(item => item.key),
		datasets: [{
				label: 'receive fps',
				data: props.receiveFPS.map((item)=>item.value),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},{
				label: 'decode fps',
				data: props.decodeFPS.map((item)=>item.value),
				borderColor: '#fff',
				backgroundColor: "#fff",
		}],
	}, {
		labels: props.packetLoss.map(item => item.key),
		datasets: [{
			label: 'packetloss',
			data: props.packetLoss.map((item)=>item.value),
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		}],
	}, {
		labels: props.bandwidth.map(item => item.key),
		datasets: [{
			label: 'bandwidth',
			data: props.bandwidth.map((item)=>item.value),
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		}],
	}, {
		labels: props.buffer.map(item => item.key),
		datasets: [{
			label: 'buffered frame',
			data: props.buffer.map((item)=>item.value),
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		}],
	}]

	const handleOpen = () => {
		setOpen(!isOpen)
	}
	return (
		<Container className={isOpen ? 'slide-in' : 'slide-out'}>
			<Button onClick={handleOpen}>
				{
					isOpen 
					? <IoIosArrowForward style={{fontSize:34}} color="white"/> 
					: <IoIosArrowBack 	 style={{fontSize:34}} color="white"/>
				}
			</Button>
			{
				isOpen &&
				<WrapperContent >
					<Text>Status Video: {props.videoConnect}</Text>
					<Text>Status audio: {props.audioConnect}</Text>
					{ data.map((val,key) => { return <Line options={options} data={val} /> }) }
				</WrapperContent>
			}

		</Container>
	);
}


const slideInAnimation = keyframes`
  from {
    transform: translateX(95%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOutAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(95%);
  }
`
const Container = styled.div`
	display: flex;
	position: fixed;
	top: 0px;
	right: 0;

	width: 200px;
	min-height: 500px;
	animation-duration: 0.5s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: both;
	/*transform: translateX(5%);		*/

	&.slide-in {
    	animation-name: ${slideInAnimation};
		
	}

	&.slide-out {
		animation-name: ${slideOutAnimation};
	}	
`

const WrapperContent = styled.div`
    width: 100%;
    height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 15px;	
	margin-left: 16px;
	padding: 16px 0;
	padding-left: 16px;
	background: rgb(242 232 232 / 16%);

`
const Text = styled.span`
	color: white;
`
const Button = styled.button`
	position: absolute;
	top: -50%;
    left: -12px;
    bottom: -50%;
	outline: none;
	border: none;
	background: none;
`
interface Props {
	videoConnect?: 'loading' | 'connect' | 'disconnect' | string
	audioConnect?: 'loading' | 'connect' | 'disconnect' | string
	fps?: string
}
export default Metric