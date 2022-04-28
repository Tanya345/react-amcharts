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
		cursor: false,
		legend: false,
		tooltip: false,
		cursorX: true,
		cursorY: true,
		fillOpacity: 0.5
	})

	useEffect(() => {
		if (firstRender.current) {
			let root = am5.Root.new('chartdiv');
			rootChart.current = root;
			firstRender.current = false;
			let barChart = createLineChart(config);
			return (() => {
				barChart.dispose()
			})
		}
		else {
			let barChart = createLineChart(config);
			return (() => {
				barChart.dispose()
			})
		}
	}, [config])

	function createLineChart(config) {
		rootChart.current.setThemes([am5themes_Animated.new(rootChart.current)]);

		let chart = rootChart.current.container.children.push(
			am5xy.XYChart.new(rootChart.current, {
				panY: false,
				layout: rootChart.current.verticalLayout,
				maxTooltipDistance: 0
			})
		);

		//Create Y-Axis
		let yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(rootChart.current, {
				renderer: am5xy.AxisRendererY.new(rootChart.current, {}),
				tooltip: am5.Tooltip.new(rootChart.current, {})
			})
		);
		yAxis.data.setAll(data)

		// Create X-Axis
		let xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(rootChart.current, {
				renderer: am5xy.AxisRendererX.new(rootChart.current, {}),
				categoryField: 'year',
				tooltip: am5.Tooltip.new(rootChart.current, {})
			})
		);
		xAxis.data.setAll(data)

		// let series1 = chart.series.push(
		// 	am5xy.LineSeries.new(rootChart.current, {
		// 		name: "Italy",
		// 		xAxis: xAxis,
		// 		yAxis: yAxis,
		// 		valueYField: 'italy',
		// 		categoryXField: 'year',
		// 		connect: false,
		// 		tooltip: am5.Tooltip.new(rootChart.current, {
		// 			labelText: "[bold]{name}:[/]\n{categoryX}:{valueY}"
		// 		})
		// 	})
		// );

		// series1.data.setAll(data);

		// series1.bullets.push(function () {
		// 	return am5.Bullet.new(rootChart.current, {
		// 		sprite: am5.Circle.new(rootChart.current, {
		// 			radius: 4,
		// 			fill: series1.get("fill")
		// 		})
		// 	});
		// });

		// series1.strokes.template.setAll({
		// 	strokeWidth: config.strokeWidth,
		// 	stroke: config.strokeColor,
		// })

		// series1.fills.template.setAll({
		// 	fillOpacity: 0.5,
		// 	// visible: true,
		// })

		function createSeries(seriesName, fieldName) {
			let series = chart.series.push(
				am5xy.LineSeries.new(rootChart.current, {
					name: seriesName,
					xAxis: xAxis,
					yAxis: yAxis,
					valueYField: fieldName,
					categoryXField: 'year',
					// fill:config.fillColor
				})
			)
			if (config.tooltip) {
				let tooltip = series.set('tooltip', am5.Tooltip.new(rootChart.current, {}))
				tooltip.label.setAll({
					text: "[bold]{categoryX}:[/]\n[width:130px]Italy:[/]{italy}\n[width:130px]Germany:[/]{germany}\n[width:130px]Uk:[/]{uk}"
				})
			}

			series.data.setAll(data)
			series.bullets.push(function () {
				return am5.Bullet.new(rootChart.current, {
					sprite: am5.Circle.new(rootChart.current, {
						radius: 4,
						fill: series.get("fill")
					})
				});
			});
			series.strokes.template.setAll({
				strokeWidth: config.strokeWidth,
				stroke: config.strokeColor,
			})
			series.fills.template.setAll({
				fillOpacity: config.fillOpacity,
				visible: true,
			})
		}
		createSeries('Italy', 'italy');
		createSeries('Germany', 'germany');
		createSeries('Uk', 'uk');

		if (config.cursor) {
			var cursor = chart.set("cursor", am5xy.XYCursor.new(rootChart.current, {
				behaviour: "zoomX"
			}));
		}
		!config.cursorX && cursor.lineX.set("visible", false);
		!config.cursorY && cursor.lineY.set("visible", false);

		if (config.legend) {
			var legend = chart.children.push(
				am5.Legend.new(rootChart.current, {})
			);
			legend.data.setAll(chart.series.values)
		}
		return chart;
	}

	const handleStrokeColor = (color) => {
		setConfig(prevState => ({ ...prevState, strokeColor: color.hex }))
	}

	const handleFillColor = (color) => {
		setConfig(prevState => ({ ...prevState, fillColor: color.hex }))
	}

	const handleIncStrokeWidth = () => {
		setConfig(prevState => ({ ...prevState, strokeWidth: Number(prevState.strokeWidth) + 1 }))
	}

	const handleDecStrokeWidth = () => {
		setConfig(prevState => ({ ...prevState, strokeWidth: Number(prevState.strokeWidth) - 1 }))
	}

	const handleCursorCheck = (e) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setConfig(prevState => ({ ...prevState, cursor: true }))
		}
		else {
			setConfig(prevState => ({ ...prevState, cursor: false }))
		}
	}

	const handleLegendCheck = (e) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setConfig(prevState => ({ ...prevState, legend: true }))
		}
		else {
			setConfig(prevState => ({ ...prevState, legend: false }))
		}
	}

	const handleTooltipCheck = (e) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setConfig(prevState => ({ ...prevState, tooltip: true }))
		}
		else {
			setConfig(prevState => ({ ...prevState, tooltip: false }))
		}
	}

	const handleCursorXCheck = (e) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setConfig(prevState => ({ ...prevState, cursorX: true }))
		}
		else {
			setConfig(prevState => ({ ...prevState, cursorX: false }))
		}
	}

	const handleCursorYCheck = (e) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setConfig(prevState => ({ ...prevState, cursorY: true }))
		}
		else {
			setConfig(prevState => ({ ...prevState, cursorY: false }))
		}
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

				<div>
					<div className="strokeWidth position-relative">
						<p className='pStyle'>StrokeWidth</p>
						<input value={config.strokeWidth} onChange={(e) => setConfig(prevState => ({ ...prevState, strokeWidth: e.target.value }))} style={{ width: '128px', textAlign: 'center' }} />
						<button className='incStrokeWidthBtn' onClick={handleIncStrokeWidth}>+</button>
						<button className='decStrokeWidthBtn' onClick={handleDecStrokeWidth} disabled={config.strokeWidth <= 0}>-</button>
					</div>
					<div className="position-relative">
						<p className='pStyle'>Fill Opacity</p>
						<input value={config.fillOpacity} onChange={(e) => setConfig(prevState => ({ ...prevState, fillOpacity: e.target.value }))} style={{ width: '128px', textAlign: 'center' }} />
						<button className='incFillOpacityBtn' disabled={config.fillOpacity === 1} onClick={() => setConfig(prevState => ({ ...prevState, fillOpacity: Number(config.fillOpacity) + 0.1 }))}>+</button>
						<button className='decFillOpacityBtn' onClick={() => setConfig(prevState => ({ ...prevState, fillOpacity: Number(config.fillOpacity) - 0.1 }))} disabled={config.fillOpacity === 0}>-</button>
					</div>
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
						<div className="d-flex flex-row align-items-center justify-content-center">
							<input type="checkbox" name="cursor" onClick={handleCursorCheck} />
							<p className='pStyle'>Show Cursor</p>

						</div>
						{config.cursor &&
							<div className="d-flex flex-row align-items-center justify-content-center">
								<input type="checkbox" name="cursorX" onClick={handleCursorXCheck} defaultChecked />
								<p className='pStyle' style={{ fontSize: '0.7em' }}>Cursor X</p>
								<input type="checkbox" name="cursorY" onClick={handleCursorYCheck} defaultChecked />
								<p className='pStyle' style={{ fontSize: '0.7em' }}>Cursor Y</p>

							</div>
						}

						{config.cursor && <div className="d-flex flex-row align-items-center justify-content-center" style={{ width: '128px' }}>
							<input type="checkbox" name="tooltip" onClick={handleTooltipCheck} />
							<p className='pStyle' style={{ fontSize: '0.7em' }}>Show Tooltip</p>
						</div>}

						<div className="d-flex flex-row align-items-center justify-content-center" style={{ width: '128px' }}>
							<input type="checkbox" name="legend" onClick={handleLegendCheck} />
							<p className='pStyle'>Show Legend</p>
						</div>
					</div>
				</div>

			</div>
			<div id="chartdiv" style={{ width: "100%", height: "500px", alignSelf: "end" }}></div>
		</div>
	)
}

export default Chart