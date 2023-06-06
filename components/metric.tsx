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




const Metric = (props: {metrics: Data[]}) => {
	const [isOpen, setOpen] = React.useState(false)

	const data = {
		labels: props.metrics.map(item => item.key),
		datasets: [
			{
				label: 'FPS',
				data: props.metrics.map((item)=>item.value),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			}
		],
	};
	const handleOpen = () => {
		setOpen(!isOpen)
	}
	return (
		<Container className={isOpen ? 'slide-in' : 'slide-out'}>
			<Button onClick={handleOpen}>
				{
					isOpen ? <IoIosArrowForward color="white"/> :
						<IoIosArrowBack color="white"/>
				}
			</Button>
			{
				isOpen &&
				<WrapperContent >
					<Line options={options} data={data} />;
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
	top: 100px;
	right: 0;

	width: 300px;
	height: 150px;
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
	gap: 5px;	
	margin-left: 16px;
	padding-left: 16px;
	background: rgb(242 232 232 / 16%);

`
const Text = styled.span`
	color: white;
`
const Button = styled.button`
	position: absolute;
	top: -50%;
    left: 0;
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