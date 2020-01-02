var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /วันนี้|พรุ่งนี้|เมื่อวาน|เมื่อคืน/i;

exports.Parser = function THCasualDateParser(){
    
    Parser.apply(this, arguments);
        
    this.pattern = function() { return PATTERN; }
    
    this.extract = function(text, ref, match, opt){ 
        
        var index = match.index;
        var text = match[0];
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        var refMoment = moment(ref);
        var startMoment = refMoment.clone();
        console.log(startMoment);
        
        if (text == 'เมื่อวาน' || text == 'เมื่อคืน') {
            startMoment.add(-1, 'day');
        } else if (text == 'พรุ่งนี้') {
            startMoment.add(1, 'day');
        }

        result.start.assign('day', startMoment.date())
        result.start.assign('month', startMoment.month() + 1)
        result.start.assign('year', startMoment.year())
        result.start.assign('hour', startMoment.hour());
        result.start.assign('minute', refMoment.minute());
        result.start.assign('second', refMoment.second());
        result.start.assign('millisecond', refMoment.millisecond());
        result.tags['THCasualDateParser'] = true;
        return result;
    }
}