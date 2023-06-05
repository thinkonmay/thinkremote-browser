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

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
		},
	},
};

const labels:Data[] = [{
	key: '10:03',
	value: 5
},
{
	key: '10:04',
	value: 6
},{
	key: '10:06',
	value: 7
},
{
	key: '10:08',
	value: 4
},
{
	key: '10:09',
	value: 10
},
{
	key: '10:14',
	value: 1
}];

interface Data{
	key: string,
	value: number
}

export const data = {
	labels: labels.map(item => item.key),
	datasets: [
		{
			label: 'FPS',
			data: labels.map((item)=>item.value),
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		},
		{
			label: 'Bitrate',
			data: labels.map(() => faker.datatype.number({ min: 0, max: 10 })),
			borderColor: 'rgb(53, 162, 235)',
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
		},
	],
};


const Metric = () => {
	const [isOpen, setOpen] = React.useState(false)

	console.log('render');
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