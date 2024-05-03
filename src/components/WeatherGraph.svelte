<script>
	import { Line } from 'svelte-chartjs';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { fetchData } from '../services/weatherProvider.js';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		TimeScale,
		Filler
	} from 'chart.js';
	import 'chartjs-adapter-moment';
	import { onMount } from 'svelte';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		TimeScale,
		Filler
	);


	const options = {
		responsive: true,
		scales: {
			x: {
				type: 'time',
				time: {
					parser: 'YYYY-MM-DDTHH:mm:ss',
					unit: 'hour',
					tooltipFormat: 'MMM D, hA',
					displayFormats: {
						hour: 'MMM D, hA'
					}
				},
				title: {
					display: true,
					text: 'Time'
				}
			},
			y: {
				title: {
					display: true,
					text: 'Value'
				}
			}
		},
		plugins: {
			legend: {
				position: 'top'
			},
			title: {
				display: true,
				text: 'Chart.js Line Chart'
			}
		}
	};

	let temperatureData;
	let humidityData;
	let pressureData;
	let data = { labels: [], datasets: [] };

	let url = 'https://whcfbb8xff.execute-api.eu-west-1.amazonaws.com/prod/get50records';

	function updateCharts() {
		temperatureData = {
			...data,
			datasets: [data.datasets[0]]
		};
		humidityData = {
			...data,
			datasets: [data.datasets[1]]
		};
		pressureData = {
			...data,
			datasets: [data.datasets[2]]
		};
	}

	async function refreshData() {
		const { timestamps, temperatures, humidities, pressures } = await fetchData(url);
		data.labels = timestamps;
		data.datasets = [
			{
				label: 'Temperature (°C)',
				borderColor: 'rgba(255, 99, 132, 1)',
				fill: false,
				data: temperatures
			},
			{
				label: 'Humidity (%)',
				borderColor: 'rgba(54, 162, 235, 1)',
				fill: false,
				data: humidities
			},
			{
				label: 'Pressure (hPa)',
				borderColor: 'rgba(75, 192, 192, 1)',
				fill: false,
				data: pressures
			}
		];
		updateCharts();
	}

	let selected = 'device';
	function updateSelection() {
		if (selected == 'device') {
			url = 'https://whcfbb8xff.execute-api.eu-west-1.amazonaws.com/prod/get50records';
			refreshData();
		} else {
			url = 'https://whcfbb8xff.execute-api.eu-west-1.amazonaws.com/prod/get50recordsimulator';
			refreshData();
		}
	}

	onMount(refreshData);
</script>
<div class="container md:hidden">
	<Tabs>
		<div class="flex w-full justify-center">
			<TabItem open title="Temperature"
							 class="md:hidden w-32 text-center sm:mx-4 py-3 px-4 bg-gray-700 text-gray-100 transition-colors hover:bg-red-400/45 ">
				<h2 class="mt-8 text-red-700 font-bold text-center">Temperature Chart</h2>
				<Line data={temperatureData} {...options} />

			</TabItem>

			<TabItem title="Humidity"
							 class="md:hidden w-32 text-center sm:mx-4 py-3 px-4 bg-gray-700 text-gray-100 transition-colors hover:bg-blue-400/45">
				<h2 class="mt-8 text-blue-700 font-bold text-center">Humidity Chart</h2>
				<Line data={humidityData} {...options} />
			</TabItem>

			<TabItem title="Pressure"
							 class="md:hidden w-32 text-center sm:mx-4 py-3 px-4 bg-gray-700 text-gray-100 transition-colors hover:bg-cyan-400/45 ">

				<h2 class="mt-8 text-cyan-700 font-bold text-center">Pressure Chart</h2>
				<Line data={pressureData} {...options} />
			</TabItem>
		</div>
	</Tabs>

	<div class="flex items-center justify-around max-w-sm mx-auto">
		<form class="inline align-middle">
			<select bind:value={selected} on:change={updateSelection}
							class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
				<option selected value="device">Device</option>
				<option value="emulator">Emulator</option>
			</select>
		</form>

		<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={refreshData}>
			Refresh Data
		</button>
	</div>

</div>
<div class="container mx-auto hidden md:block">
	<h1 class="font-bold text-3xl mb-4">Weather Graph</h1>

	<div class="flex flex-row">
		<div class="w-1/3">
			<h2 class="mt-8 text-red-700 font-bold text-center">Temperature Chart</h2>
			<Line data={temperatureData} {...options} />
		</div>
		<div class="w-1/3">
			<h2 class="mt-8 text-blue-700 font-bold text-center">Humidity Chart</h2>
			<Line data={humidityData} {...options} />
		</div>
		<div class="w-1/3">
			<h2 class="mt-8 text-cyan-700 font-bold text-center">Pressure Chart</h2>
			<Line data={pressureData} {...options} />
		</div>
	</div>
	<div class="flex items-center justify-around max-w-sm mx-auto">
		<form class="inline align-middle">
			<select bind:value={selected} on:select={() => updateSelection()}
							class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
				<option selected value="device">Device</option>
				<option value="emulator">Emulator</option>
			</select>
		</form>

		<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={refreshData}>
			Refresh Data
		</button>
	</div>
</div>

