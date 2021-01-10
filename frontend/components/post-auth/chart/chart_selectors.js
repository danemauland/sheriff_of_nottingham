import React from "react";
import {
    GRAPH_VIEWS,
    
    getViewName
} from "../../../util/chart_utils";
import ChartSelectorItem from "./chart_selector_item";

export default ({genClassNames, genChartChanger}) => (
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
            </div>
        </div>
);