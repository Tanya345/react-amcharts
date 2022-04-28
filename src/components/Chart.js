import React, { useEffect, useRef, useState } from 'react'
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { HuePicker } from 'react-color';
import data from '../data.json';

const widthArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const Chart = () => {
	let rootChart = useRef();
	let firstRender = useRef(true)
	const [config, setConfig] = useState({
		width: 70,
		strokeColor: '#000000',
		strokeWidth: 1,
		fillColor: '#00ffff',
		cornerRadiusTL: 0,
		cornerRadiusTR: 0
	})

	useEffect(() => {
		if (firstRender.current) {
			let root = am5.Root.new('chartdiv');
			rootChart.current = root;
			firstRender.current = false;
			let barChart = createBarChart(config);
			return (() => {
				barChart.dispose()
			})
		}
		else {
			let barChart = createBarChart(config);
			return (() => {
				barChart.dispose()
			})
		}
	}, [config])

	function createBarChart(config) {
		rootChart.current.setThemes([am5themes_Animated.new(rootChart.current)]);

		let chart = rootChart.current.container.children.push(
			am5xy.XYChart.new(rootChart.current, {
				panY: false,
				layout: rootChart.current.verticalLayout
			})
		);

		//Create Y-Axis
		let yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(rootChart.current, {
				renderer: am5xy.AxisRendererY.new(rootChart.current, {})
			})
		);
		yAxis.data.setAll(data)

		// Create X-Axis
		let xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(rootChart.current, {
				renderer: am5xy.AxisRendererX.new(rootChart.current, {}),
				categoryField: 'category'
			})
		);
		xAxis.data.setAll(data)

		let series1 = chart.series.push(
			am5xy.ColumnSeries.new(rootChart.current, {
				name: "Series",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value1',
				categoryXField: 'category'
			})
		);
		series1.data.setAll(data);

		series1.columns.template.setAll({
			width: am5.percent(config.width),
			fill: config.fillColor,
			strokeWidth: config.strokeWidth,
			stroke: config.strokeColor,
			cornerRadiusTL: config.cornerRadiusTL,
			cornerRadiusTR: config.cornerRadiusTR
		});
		return chart;
	}

	const handleStrokeColor = (color) => {
		setConfig(prevState => ({ ...prevState, strokeColor: color.hex }))
	}

	const handleFillColor = (color) => {
		setConfig(prevState => ({ ...prevState, fillColor: color.hex }))
	}

	const handleCornerRadiusTLChange = (e) => {
		setConfig(prevState => ({ ...prevState, cornerRadiusTL: e.target.value }))
	}
	const handleCornerRadiusTRChange = (e) => {
		setConfig(prevState => ({ ...prevState, cornerRadiusTR: e.target.value }))
	}

	const handleIncCornerRadiusTL = () => {
		setConfig(prevState => ({ ...prevState, cornerRadiusTL: prevState.cornerRadiusTL + 1 }))
	}

	const handleDecCornerRadiusTL = () => {
		setConfig(prevState => ({ ...prevState, cornerRadiusTL: prevState.cornerRadiusTL - 1 }))
	}

	const handleIncCornerRadiusTR = () => {
		setConfig(prevState => ({ ...prevState, cornerRadiusTR: prevState.cornerRadiusTR + 1 }))
	}

	const handleDecCornerRadiusTR = () => {
		setConfig(prevState => ({ ...prevState, cornerRadiusTR: prevState.cornerRadiusTR - 1 }))
	}

	const handleIncStrokeWidth = () => {
		setConfig(prevState => ({ ...prevState, strokeWidth: prevState.strokeWidth + 1 }))
	}

	const handleDecStrokeWidth = () => {
		setConfig(prevState => ({ ...prevState, strokeWidth: prevState.strokeWidth - 1 }))
	}

	return (
		<div className='d-flex flex-column justify-content-between p-2 flex-wrap'>
			<div className='d-flex justify-content-between flex-wrap' >

				<div>
					<div className="d-flex flex-column">
						<p className='pStyle'>Stroke</p>
						<HuePicker color={config.strokeColor} onChangeComplete={handleStrokeColor} />
					</div>

					<div className="d-flex flex-column">
						<p className='pStyle'>Fill</p>
						<HuePicker color={config.fillColor} onChangeComplete={handleFillColor} />
					</div>
				</div>

				<div className="strokeWidth position-relative">
					<p className='pStyle'>StrokeWidth</p>
					<input value={config.strokeWidth} onChange={(e) => setConfig(prevState => ({ ...prevState, strokeWidth: e.target.value }))} style={{ width: '128px', textAlign: 'center' }} />
					<button className='incStrokeWidthBtn' onClick={handleIncStrokeWidth}>+</button>
					<button className='decStrokeWidthBtn' onClick={handleDecStrokeWidth} disabled={config.strokeWidth <= 0}>-</button>
				</div>
				<div>
					<div className="dropdown d-flex flex-column align-items-end">
						<button className="btn btn-secondary dropdown-toggle mt-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
							Width: {config.width ? config.width : ''}
						</button>
						<ul className="dropdown-menu overflow-auto" aria-labelledby="dropdownMenuButton1" style={{ height: 'auto' }}>
							{widthArr.map((w, i) => <li key={i}><button className="dropdown-item" onClick={() => setConfig(prevState => ({ ...prevState, width: w }))}>{w}</button></li>)}
						</ul>
					</div>

					<div>
						<div className="d-flex flex-column position-relative" style={{ width: '128px' }}>
							<p className='pStyle'>TL</p>
							<input value={config.cornerRadiusTL} onChange={handleCornerRadiusTLChange} style={{ textAlign: 'center' }} />
							<button className='incCornerRadiusTLBtn' onClick={handleIncCornerRadiusTL}>+</button>
							<button className='decCornerRadiusTLBtn' onClick={handleDecCornerRadiusTL} disabled={config.cornerRadiusTL <= 0}>-</button>
						</div>
						<div className="d-flex flex-column position-relative" style={{ width: '128px' }}>
							<p className='pStyle'>TR</p>
							<input value={config.cornerRadiusTR} onChange={handleCornerRadiusTRChange} style={{ textAlign: 'center' }} />
							<button className='incCornerRadiusTRBtn' onClick={handleIncCornerRadiusTR}>+</button>
							<button className='decCornerRadiusTRBtn' onClick={handleDecCornerRadiusTR} disabled={config.cornerRadiusTR <= 0}>-</button>
						</div>

					</div>
				</div>

			</div>
			<div id="chartdiv" style={{ width: "100%", height: "500px", alignSelf: "end" }}></div>
		</div>
	)
}

export default Chart