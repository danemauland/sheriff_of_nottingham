import React from "react";
import {
    GRAPH_VIEWS,
    chartSelectorClassNamesGenerator,
    getViewName
} from "../../../util/chart_utils";
import ChartSelectorItem from "./chart_selector_item";

export default ({valInc, selectedView, genChartChanger}) => {
    const genClassNames = chartSelectorClassNamesGenerator(valInc,selectedView);
    return (
        <div className="chart-selector-spacer">
            <div className="chart-selector-flex-container">
                {GRAPH_VIEWS.map((view, i) => (
                    <ChartSelectorItem
                        key={i}
                        classNames={genClassNames(view)}
                        viewName={getViewName(view)}
                        chartChanger={genChartChanger(view)}
                    />
                ))}
                {/* <a className={this.generateClassNames(ONE_DAY)} onClick={this.generateChartChanger(ONE_DAY)}><div className="chart-selector-link-text">1D</div></a>
                <a className={this.generateClassNames(ONE_WEEK)} onClick={this.generateChartChanger(ONE_WEEK)}><div className="chart-selector-link-text">1W</div></a>
                <a className={this.generateClassNames(ONE_MONTH)} onClick={this.generateChartChanger(ONE_MONTH)}><div className="chart-selector-link-text">1M</div></a>
                <a className={this.generateClassNames(THREE_MONTH)} onClick={this.generateChartChanger(THREE_MONTH)}><div className="chart-selector-link-text">3M</div></a>
                <a className={this.generateClassNames(ONE_YEAR)} onClick={this.generateChartChanger(ONE_YEAR)}><div className="chart-selector-link-text">1Y</div></a> */}
            </div>
        </div>
)}