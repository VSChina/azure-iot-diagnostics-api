webpackJsonp([1],[,,,,,,,,function(t,e,a){"use strict";var s=a(4),i=a(39),r=a(35),n=a.n(r),l=a(34),c=a.n(l);s.a.use(i.a),e.a=new i.a({routes:[{path:"/",name:"home",component:n.a},{path:"/appmap",name:"appMap",component:c.a}],linkActiveClass:"active"})},function(t,e,a){a(32);var s=a(3)(a(11),a(38),null,null);t.exports=s.exports},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(4),i=a(9),r=a.n(i),n=a(8);s.a.config.productionTip=!1,new s.a({el:"#app",router:n.a,template:"<App/>",components:{App:r.a}})},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app"}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(16),i=a.n(s),r=a(17),n=a.n(r),l=function(){function t(e){i()(this,t),this.callInterval=e,this.deviceInfoInterval=e,this.d2cPath="customMetrics/D2CLatency",this.saPath="customMetrics/StreamJobLatency",this.d2cLatencyParam=null,this.d2cLatencyCallback=null,this.mertricsParam=null,this.saLatencyCallback=null,this.deviceInfoParam=null,this.deviceInfoCallback=null}return n()(t,[{key:"getMetrics",value:function(t,e){var a=this;$.ajax({url:"/metric/get/"+t+"?time="+Date.now(),datatype:"json",success:function(t){e(t)},complete:function(){a.enabled&&setTimeout(function(){a.mertricsParam&&a.mertricsCallback&&a.getMetrics(a.mertricsParam,a.mertricsCallback)},a.callInterval)}})}},{key:"getDeviceInfo",value:function(t){var e=this;$.ajax({url:"/device/get_total?time="+Date.now(),datatype:"json",success:function(e){t(e)},complete:function(){e.enabled&&setTimeout(function(){e.deviceInfoCallback&&e.getDeviceInfo(e.deviceInfoCallback)},e.callInterval)}})}},{key:"updateMetricsParam",value:function(t){this.mertricsParam=t}},{key:"setMetricsCallBack",value:function(t,e){this.mertricsParam=t,this.mertricsCallback=e}},{key:"setDeviceInfoCallback",value:function(t){this.deviceInfoCallback=t}},{key:"startAll",value:function(){var t=this;this.enabled=!0,t.mertricsParam&&t.mertricsCallback&&t.getMetrics(t.mertricsParam,t.mertricsCallback),t.deviceInfoCallback&&t.getDeviceInfo(t.deviceInfoCallback)}},{key:"stopAll",value:function(){this.enabled=!1}}]),t}(),c=new l(2e3);e.default={name:"appMap",data:function(){return{device:{registeredNum:"-",connectedNum:"-"},iotHub:{latency:"-",processedMessage:"-",latencyMax:"-"},streamAnalytics:{processedMessage:"-",latency:"-",failures:"-",failurePercentage:"-",latencyMax:"-"},selected:"PT10M",functionApp:{processedMessage:"-",latency:"-",failures:"-",failurePercentage:"-",latencyMax:"-",systemFailures:"-"},showFunc:!localStorage.getItem("showFunc")||"true"===localStorage.getItem("showFunc"),showSA:!localStorage.getItem("showSA")||"true"===localStorage.getItem("showSA"),jsPlumb:a(33).jsPlumb}},watch:{showFunc:function(t,e){setTimeout(function(){t?this.jsPlumb.show("item_function"):this.jsPlumb.hide("item_function"),this.jsPlumb.repaintEverything()},0),localStorage.setItem("showFunc",t)},showSA:function(t,e){setTimeout(function(){t?this.jsPlumb.show("item_stream"):this.jsPlumb.hide("item_stream"),this.jsPlumb.repaintEverything()},0),localStorage.setItem("showSA",t)}},beforeDestroy:function(){c.stopAll(),this.jsPlumb.deleteEveryConnection(),location.reload()},methods:{updateMetricsParam:function(){c.updateMetricsParam("timespan="+this.selected)}},mounted:function(){function t(t,e,a,s){if(e&&(t.latency=null===e.avg?"-":e.avg,t.latencyMax=null===e.max?"-":e.max,t.processedMessage=e.count),a){t.failures=a.sum;var i=0;t.processedMessage+t.failures!==0&&(i=(t.failures/(t.processedMessage+t.failures)*100).toFixed(2)),t.failurePercentage=i}s&&(t.systemFailures=s.sum)}var e=this;c.setMetricsCallBack("timespan="+this.selected,function(a){t(e.iotHub,a.d2c_success),t(e.streamAnalytics,a.sa_success,a.sa_failure_count),t(e.functionApp,a.func_success,a.func_failure_count,a.func_system_failure)}),c.setDeviceInfoCallback(function(t){e.device.connectedNum=t.connected,e.device.registeredNum=t.registered}),c.startAll(),this.jsPlumb.ready(function(){e.jsPlumb.Defaults.Container=document.getElementById("diagram-container"),console.log("ready"),e.jsPlumb.connect({paintStyle:{stroke:"#999",strokeWidth:1},source:"item_left",target:"item_middle",anchor:["Left","Right"],endpoint:["Blank",{radius:2}],connector:["Straight"],overlays:[["Arrow",{location:1,width:12,length:12}],["Label",{label:"",cssClass:"label-class"}]]}),e.jsPlumb.connect({paintStyle:{stroke:"#999",strokeWidth:1},source:"item_middle",target:"item_stream",anchor:["Left","Right"],endpoint:["Blank",{radius:2}],connector:["Straight"],overlays:[["Arrow",{location:1,width:12,length:12}],["Label",{label:"",cssClass:"label-class"}]]}),e.jsPlumb.connect({paintStyle:{stroke:"#999",strokeWidth:1},source:"item_middle",target:"item_function",anchor:["Left","Right"],endpoint:["Blank",{radius:2}],connector:["Flowchart"],overlays:[["Arrow",{location:1,width:12,length:12}],["Label",{label:"",cssClass:"label-class"}]]}),"none"===document.getElementById("item_function").style.display&&e.jsPlumb.hide("item_function"),"none"===document.getElementById("item_stream").style.display&&e.jsPlumb.hide("item_stream"),e.jsPlumb.on(window,"resize",e.jsPlumb.repaintEverything)})}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(14),i=a.n(s);e.default={name:"home",data:function(){return{msg:"Diagnostics Settings",connectionString:localStorage.getItem("connectionString"),status:"ON",sample:"100",devices:"",result:"",detailedResult:"",isUpdating:!1}},methods:{updateSetting:function(){var t=this;this.result="Start updating diagnostics settings...",this.detailedResult="",this.isUpdating=!0;var e="/job/trigger?diag_enable="+("ON"===this.status)+"&diag_rate="+this.sample+"&connection_string="+encodeURIComponent(this.connectionString);this.devices&&(e+="&devices="+this.devices),$.get(e).done(function(e){var a=e;t.result="Updating diagnostics settings...";var s=setInterval(function(){$.get("/job/get?id="+a+"&connection_string="+encodeURIComponent(t.connectionString)).done(function(e){if("completed"===e.status||"failed"===e.status||"cancelled"===e.status){t.result="Status: "+e.status;var a={createdTime:e.createdTime,startTime:e.startTime,endTime:e.endTime,deviceJobStatistics:e.deviceJobStatistics};t.detailedResult=i()(a,null,2),clearInterval(s),t.isUpdating=!1}})},1e3)}).fail(function(e){t.result="Error: could not update diagnostics settings",t.detailedResult=e,t.isUpdating=!1})},onFileChange:function(t){var e=this,a=t.target.files||t.dataTransfer.files;if(a.length){var s=a[0],i=new FileReader;i.onload=function(t){e.devices=t.target.result},i.readAsBinaryString(s)}}}}},,,,,,,,,,,,,,,,,function(t,e){},function(t,e){},function(t,e){},,function(t,e,a){a(30);var s=a(3)(a(12),a(36),"data-v-2cee245c",null);t.exports=s.exports},function(t,e,a){a(31);var s=a(3)(a(13),a(37),"data-v-6fba60f6",null);t.exports=s.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"diagram-container"}},[a("div",{staticClass:"item-container"},[a("div",{staticClass:"item",attrs:{id:"item_left"}},[t._m(0),t._v(" "),a("div",{staticClass:"table-container"},[a("table",{staticClass:"item-left-table"},[a("col",{attrs:{width:"30%"}}),t._v(" "),a("col",{attrs:{width:"60%"}}),t._v(" "),a("col",{attrs:{width:"20",align:"right"}}),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.device.registeredNum)?"-":t.device.registeredNum))]),t._v(" "),a("td",[t._v("Registered Devices")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.device.connectedNum)?"-":t.device.connectedNum))]),t._v(" "),a("td",[t._v("Connected Devices")]),t._v(" "),a("td")])])])]),t._v(" "),a("div",{staticClass:"item",attrs:{id:"item_middle"}},[t._m(1),t._v(" "),a("div",{staticClass:"table-container"},[a("table",{staticClass:"item-middle-table"},[a("col",{attrs:{width:"45%"}}),t._v(" "),a("col",{attrs:{width:"50%"}}),t._v(" "),a("col",{attrs:{width:"20%",align:"right"}}),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.iotHub.processedMessage)?"-":t.iotHub.processedMessage))]),t._v(" "),a("td",[t._v("Msgs Received")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.iotHub.latency)?"-":t.iotHub.latency+" ms"))]),t._v(" "),a("td",[t._v("Avg Latency")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.iotHub.latencyMax)?"-":t.iotHub.latencyMax+" ms"))]),t._v(" "),a("td",[t._v("Max Latency")]),t._v(" "),a("td")])])])]),t._v(" "),a("div",{staticClass:"vcontainer",attrs:{id:"item_group"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:!0===t.showSA,expression:"showSA === true"}],staticClass:"item",attrs:{id:"item_stream"}},[t._m(2),t._v(" "),a("div",{staticClass:"table-container"},[a("table",{staticClass:"item-right-table"},[a("col",{attrs:{width:"45%"}}),t._v(" "),a("col",{attrs:{width:"50%"}}),t._v(" "),a("col",{attrs:{width:"20%",align:"right"}}),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.streamAnalytics.processedMessage)?"-":t.streamAnalytics.processedMessage+t.streamAnalytics.failures))]),t._v(" "),a("td",[t._v("Msgs Processed")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.streamAnalytics.latency)?"-":t.streamAnalytics.latency+" ms"))]),t._v(" "),a("td",[t._v("Avg Latency")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.streamAnalytics.latencyMax)?"-":t.streamAnalytics.latencyMax+" ms"))]),t._v(" "),a("td",[t._v("Max Latency")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.streamAnalytics.failurePercentage)?"-":t.streamAnalytics.failurePercentage+"%"))]),t._v(" "),a("td",[t._v("Failures")]),t._v(" "),a("td",[a("div",{staticClass:"svg-style"},[t.streamAnalytics.failurePercentage<5?a("svg",{attrs:{viewBox:"0 0 16 16",role:"presentation","aria-hidden":"true",focusable:"false"}},[a("g",{attrs:{"aria-hidden":"true",role:"presentation"}},[a("circle",{staticClass:"msportalfx-svg-c14",staticStyle:{fill:"green"},attrs:{cx:"8",cy:"8",r:"8","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("path",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"white"},attrs:{d:"M3.989 8.469L3.7 8.156a.207.207 0 0 1 .012-.293l.835-.772a.204.204 0 0 1 .289.012l2.296 2.462 3.951-5.06a.204.204 0 0 1 .289-.035l.903.697a.198.198 0 0 1 .035.285l-5.075 6.497-3.246-3.48z","aria-hidden":"true",role:"presentation"}})])]):t.streamAnalytics.failurePercentage<20?a("svg",{attrs:{viewBox:"0 0 9 9",role:"presentation","aria-hidden":"true",focusable:"false"}},[a("g",{attrs:{"aria-hidden":"true",role:"presentation"}},[a("path",{staticClass:"msportalfx-svg-c10",staticStyle:{fill:"#ff8c00"},attrs:{d:"M8.267 8H.733c-.6 0-.916-.623-.62-1.129L2.014 3.53 3.896.384c.302-.507.903-.514 1.197-.008L7.001 3.65l1.882 3.229C9.183 7.383 8.881 8 8.267 8z","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("circle",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{cx:"4.5",cy:"6.178",r:"0.615","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("path",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{d:"M4.623 2.428H3.98l.164 2.85h.774l.165-2.85z","aria-hidden":"true",role:"presentation"}})])]):a("svg",{attrs:{viewBox:"0 0 9 9",role:"presentation","aria-hidden":"true",focusable:"false"}},[a("g",{attrs:{"aria-hidden":"true",role:"presentation"}},[a("circle",{staticClass:"msportalfx-svg-c22",staticStyle:{fill:"#e81123"},attrs:{cx:"4.5",cy:"4.5",r:"4.5","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("circle",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{cx:"4.5",cy:"6.438",r:"0.697","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("path",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{d:"M4.604 2.186h-.729l.186 3.232h.878l.186-3.232z","aria-hidden":"true",role:"presentation"}})])])])])])])])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!0===t.showFunc,expression:"showFunc === true"}],staticClass:"item",attrs:{id:"item_function"}},[t._m(3),t._v(" "),a("div",{staticClass:"table-container"},[a("table",{staticClass:"item-right-table"},[a("col",{attrs:{width:"45%"}}),t._v(" "),a("col",{attrs:{width:"50%"}}),t._v(" "),a("col",{attrs:{width:"20%",align:"right"}}),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.functionApp.latency)?"-":t.functionApp.latency+" ms"))]),t._v(" "),a("td",[t._v("Avg Latency")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.functionApp.latencyMax)?"-":t.functionApp.latencyMax+" ms"))]),t._v(" "),a("td",[t._v("Max Latency")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.functionApp.processedMessage)?"-":t.functionApp.processedMessage+t.functionApp.failures))]),t._v(" "),a("td",[t._v("Total Requests")]),t._v(" "),a("td")]),t._v(" "),a("tr",[a("td",[t._v(t._s(isNaN(t.functionApp.failures)?"-":t.functionApp.failures))]),t._v(" "),a("td",[t._v("Failure Requests")]),t._v(" "),a("td",[a("div",{staticClass:"svg-style"},[t.functionApp.failurePercentage<5?a("svg",{attrs:{viewBox:"0 0 16 16",role:"presentation","aria-hidden":"true",focusable:"false"}},[a("g",{attrs:{"aria-hidden":"true",role:"presentation"}},[a("circle",{staticClass:"msportalfx-svg-c14",staticStyle:{fill:"green"},attrs:{cx:"8",cy:"8",r:"8","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("path",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"white"},attrs:{d:"M3.989 8.469L3.7 8.156a.207.207 0 0 1 .012-.293l.835-.772a.204.204 0 0 1 .289.012l2.296 2.462 3.951-5.06a.204.204 0 0 1 .289-.035l.903.697a.198.198 0 0 1 .035.285l-5.075 6.497-3.246-3.48z","aria-hidden":"true",role:"presentation"}})])]):t.functionApp.failurePercentage<20?a("svg",{attrs:{viewBox:"0 0 9 9",role:"presentation","aria-hidden":"true",focusable:"false"}},[a("g",{attrs:{"aria-hidden":"true",role:"presentation"}},[a("path",{staticClass:"msportalfx-svg-c10",staticStyle:{fill:"#ff8c00"},attrs:{d:"M8.267 8H.733c-.6 0-.916-.623-.62-1.129L2.014 3.53 3.896.384c.302-.507.903-.514 1.197-.008L7.001 3.65l1.882 3.229C9.183 7.383 8.881 8 8.267 8z","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("circle",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{cx:"4.5",cy:"6.178",r:"0.615","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("path",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{d:"M4.623 2.428H3.98l.164 2.85h.774l.165-2.85z","aria-hidden":"true",role:"presentation"}})])]):a("svg",{attrs:{viewBox:"0 0 9 9",role:"presentation","aria-hidden":"true",focusable:"false"}},[a("g",{attrs:{"aria-hidden":"true",role:"presentation"}},[a("circle",{staticClass:"msportalfx-svg-c22",staticStyle:{fill:"#e81123"},attrs:{cx:"4.5",cy:"4.5",r:"4.5","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("circle",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{cx:"4.5",cy:"6.438",r:"0.697","aria-hidden":"true",role:"presentation"}}),t._v(" "),a("path",{staticClass:"msportalfx-svg-c01",staticStyle:{fill:"#fff"},attrs:{d:"M4.604 2.186h-.729l.186 3.232h.878l.186-3.232z","aria-hidden":"true",role:"presentation"}})])])])])]),t._v(" "),a("tr",[a("td",[t._v(t._s(t.functionApp.systemFailures))]),t._v(" "),t._m(4),t._v(" "),a("td")])])])])])]),t._v(" "),a("div",[a("div",{staticClass:"component-checkbox"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.showSA,expression:"showSA"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.showSA)?t._i(t.showSA,null)>-1:t.showSA},on:{__c:function(e){var a=t.showSA,s=e.target,i=!!s.checked;if(Array.isArray(a)){var r=t._i(a,null);i?r<0&&(t.showSA=a.concat(null)):r>-1&&(t.showSA=a.slice(0,r).concat(a.slice(r+1)))}else t.showSA=i}}}),t._v("Show Stream Analytics"),a("br"),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.showFunc,expression:"showFunc"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.showFunc)?t._i(t.showFunc,null)>-1:t.showFunc},on:{__c:function(e){var a=t.showFunc,s=e.target,i=!!s.checked;if(Array.isArray(a)){var r=t._i(a,null);i?r<0&&(t.showFunc=a.concat(null)):r>-1&&(t.showFunc=a.slice(0,r).concat(a.slice(r+1)))}else t.showFunc=i}}}),t._v("Show Function App"),a("br")]),t._v(" "),a("div",{staticClass:"select"},[a("label",{attrs:{for:"selected"}},[t._v("Timespan")]),t._v(" "),a("select",{directives:[{name:"model",rawName:"v-model",value:t.selected,expression:"selected"}],staticClass:"form-control",on:{change:[function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.selected=e.target.multiple?a:a[0]},function(e){t.updateMetricsParam()}]}},[a("option",{attrs:{value:"PT10M"}},[t._v("10 Minutes")]),t._v(" "),a("option",{attrs:{value:"PT1H"}},[t._v("1 Hour")]),t._v(" "),a("option",{attrs:{value:"PT24H"}},[t._v("24 Hour")]),t._v(" "),a("option",{attrs:{value:"P7D"}},[t._v("7 Day")])])])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("p",{staticClass:"item-title"},[t._v("Devices")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("p",{staticClass:"item-title"},[t._v("IoT Hub")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("p",{staticClass:"item-title"},[t._v("Stream Analytics")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("p",{staticClass:"item-title"},[t._v("Function App")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("td",[a("a",{attrs:{href:"/metric/kusto",title:"Use 'exceptions' to query detailed information",target:"_blank"}},[t._v("System Failures")])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"setting"},[a("h1",[t._v(t._s(t.msg))]),t._v(" "),a("div",[a("form",[a("div",{staticClass:"form-group"},[a("div",{staticClass:"col-xs-3 col-xs-offset-3"},[a("label",{attrs:{for:"status"}},[t._v("Status")]),t._v(" "),a("select",{directives:[{name:"model",rawName:"v-model",value:t.status,expression:"status"}],staticClass:"form-control",attrs:{id:"status"},on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.status=e.target.multiple?a:a[0]}}},[a("option",[t._v("ON")]),t._v(" "),a("option",[t._v("OFF")])])]),t._v(" "),a("div",{staticClass:"col-xs-3"},[a("label",{attrs:{for:"sample"}},[t._v("Sample")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.sample,expression:"sample"}],staticClass:"form-control",attrs:{type:"number",id:"sample",placeholder:"sample",min:"0",max:"100"},domProps:{value:t.sample},on:{input:function(e){e.target.composing||(t.sample=e.target.value)},blur:function(e){t.$forceUpdate()}}})])]),t._v(" "),a("div",{staticClass:"form-group"},[a("div",{staticClass:"col-xs-2 col-xs-offset-3"},[a("label",{attrs:{for:"file"}},[t._v("Device File")]),t._v(" "),a("input",{staticClass:"form-control",attrs:{type:"file",id:"file"},on:{change:t.onFileChange}})]),t._v(" "),a("div",{staticClass:"col-xs-4"},[a("label",{attrs:{for:"devices"}},[t._v("Device List")]),t._v(" "),a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.devices,expression:"devices"}],staticClass:"form-control",attrs:{rows:"1",id:"devices",placeholder:"device1,device2,device3 or leave blank to update all devices"},domProps:{value:t.devices},on:{input:function(e){e.target.composing||(t.devices=e.target.value)}}})])]),t._v(" "),a("div",{staticClass:"update col-xs-6 col-xs-offset-3"},[a("button",{attrs:{type:"button",disabled:t.isUpdating},on:{click:t.updateSetting}},[t._v("Update")])])])]),t._v(" "),a("div",{staticClass:"result col-xs-6 col-xs-offset-3"},[a("div",[t.isUpdating?a("div",{staticClass:"loader"}):t._e(),t._v("\n      "+t._s(t.result)+"\n    ")]),t._v(" "),t.detailedResult?a("pre",[t._v("\n      "+t._s(t.detailedResult)+"\n    ")]):t._e()])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("nav",{staticClass:"navbar navbar-inverse"},[a("div",{staticClass:"container"},[t._m(0),t._v(" "),a("ul",{staticClass:"nav navbar-nav"},[a("li",[a("router-link",{attrs:{to:"/",exact:""}},[t._v("Home")])],1),t._v(" "),a("li",[a("router-link",{attrs:{to:"/appmap",exact:""}},[t._v("Diagnostics Map")])],1),t._v(" "),t._m(1)])])]),t._v(" "),a("router-view")],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"navbar-header"},[a("a",{staticClass:"navbar-brand",attrs:{href:"#"}},[t._v("Azure IoT Diagnostics")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("li",[a("a",{attrs:{target:"_blank",href:"/metric/kusto",exact:""}},[t._v("Kusto Query")])])}]}}],[10]);
//# sourceMappingURL=app.0615d1166dd12ceb5182.js.map