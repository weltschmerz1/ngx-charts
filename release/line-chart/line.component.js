import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import * as simplify from 'simplify-js';
var LineComponent = (function () {
    function LineComponent(element) {
        this.element = element;
        this.fill = 'none';
        this.select = new EventEmitter();
        this.initialized = false;
    }
    LineComponent.prototype.ngOnChanges = function (changes) {
        if (!this.initialized) {
            this.initialized = true;
            this.initialPath = this.path;
        }
        else {
            this.animateToCurrentForm();
        }
    };
    LineComponent.prototype.animateToCurrentForm = function () {
        var node = select(this.element.nativeElement).select('.line');
        var commands = this.path.split(/(?=[LMC])/);
        var coordinates = commands.map(function (d) {
            var pointsArray = d.slice(1, d.length).split(',');
            // let pairsArray = [];
            // for(let i = 0; i < pointsArray.length; i += 2){
            //   pairsArray.push({
            //     x: +pointsArray[i],
            //     y: +pointsArray[i+1]
            //   });
            // }
            // return pairsArray[0];
            return {
                x: pointsArray[0],
                y: pointsArray[1]
            };
        });
        var simplifiedCoordinates = simplify(coordinates, 5);
        // console.log(coordinates);
        var linefn = line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
        var simplifiedPath = linefn(simplifiedCoordinates);
        node
            .attr('d', simplifiedPath);
    };
    return LineComponent;
}());
export { LineComponent };
LineComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-line]',
                template: "\n    <svg:path\n      [@animationState]=\"'active'\"\n      class=\"line\"\n      [attr.d]=\"initialPath\"\n      [attr.fill]=\"fill\"\n      [attr.stroke]=\"stroke\"\n      stroke-width=\"1.5px\"\n    />\n  ",
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':enter', [
                            style({
                                strokeDasharray: 2000,
                                strokeDashoffset: 2000,
                            }),
                            animate(1000, style({
                                strokeDashoffset: 0
                            }))
                        ])
                    ])
                ]
            },] },
];
/** @nocollapse */
LineComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
LineComponent.propDecorators = {
    'path': [{ type: Input },],
    'stroke': [{ type: Input },],
    'data': [{ type: Input },],
    'fill': [{ type: Input },],
    'select': [{ type: Output },],
};
//# sourceMappingURL=line.component.js.map