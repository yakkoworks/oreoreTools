	function showModalDialog(id) {
		document.getElementById(id).showModal();
	}
	function closeModalDialog(id) {
		document.getElementById(id).close();
	}
	function showAddColor(){
		var index = document.getElementById("palette").childElementCount+1;
		if(index > 7) {
			alert("7色までやで");
			return;
		} else {
			showModalDialog('dialog-add-color');
		}
		
	}
	function addColor(){
		var line = document.createElement("div");
		var index = document.getElementById("palette").childElementCount+1;
		line.id = "line"+index;
		line.classList.add("line");
		line.addEventListener('click',function(){showEditColor(index);});
		var hue = document.getElementById("add-color-hue").value;
		var saturation = document.getElementById("add-color-saturation").value;
		var lightness = document.getElementById("add-color-lightness").value;
		var code = HSVtoRGB(hue,saturation / 100,lightness / 100).code;
		line.dataset.hue = hue;
		line.dataset.saturation = saturation;
		line.dataset.lightness = lightness;
		line.insertAdjacentHTML("beforeend",'<div class="color" id="color'+index+'"></div><span class="value" id="hue'+index+'"></span><span class="value" id="saturation'+index+'"></span><span class="value" id="lightness'+index+'"></span>');
		document.getElementById("palette").appendChild(line);
		document.getElementById("hue"+index).innerText = hue;
		document.getElementById("saturation"+index).innerText = saturation;
		document.getElementById("lightness"+index).innerText = lightness;
		// console.log(code);
		document.getElementById("color"+index).style.backgroundColor = code;
		document.getElementById("add-color-hue").value = '';
		document.getElementById("add-color-saturation").value = "";
		document.getElementById("add-color-lightness").value = "";
		if(index > 1 && index < 8) {
			document.getElementById("palette").style.gridTemplateColumns = "repeat("+index+", 0.5fr)";
		}
	}
	function showEditColor(index){
		var elem = document.getElementById("line"+index);
		document.getElementById("edit-index").value = index;
		document.getElementById("edit-color-hue").value = elem.dataset.hue; 
		document.getElementById("edit-color-saturation").value = elem.dataset.saturation;
		document.getElementById("edit-color-lightness").value = elem.dataset.lightness;
		showModalDialog("dialog-edit-color");
		// document.getElementById("edit-color").style.backgroundColor = "hsl("+elem.dataset.hsl+")";
	}
	function editColor(){
		var index = document.getElementById("edit-index").value;
		var target = document.getElementById("line"+index);
		target.dataset.hue = document.getElementById("edit-color-hue").value;
		target.dataset.saturation = document.getElementById("edit-color-saturation").value;
		target.dataset.lightness = document.getElementById("edit-color-lightness").value;
		var code = HSVtoRGB(target.dataset.hue,target.dataset.saturation / 100,target.dataset.lightness / 100).code;
		document.getElementById("hue"+index).innerText = target.dataset.hue;
		document.getElementById("saturation"+index).innerText = target.dataset.saturation;
		document.getElementById("lightness"+index).innerText = target.dataset.lightness;
		document.getElementById("color"+index).style.backgroundColor = code;
	}
	function changeSubtitle(){
		var subtitle = document.getElementById("input-subtitle");
		document.getElementById("subtitle").innerText = "- "+subtitle.value+" -"
		subtitle.value = "";
	}
	function setImage(){
		var image = document.getElementById("coordinate").files[0];
	const reader = new FileReader();
	reader.onloadend = () => {
		const dataUrl = reader.result;
		var background = document.getElementById("output");
		background.style.backgroundImage = "url("+dataUrl+"),url(background.png)";
	}
	reader.readAsDataURL(image);
	}
	function saveImage(){
		var node = document.querySelector("#output");
		showModalDialog("dialog-saving");
		node.style.zoom = "unset";
		domtoimage.toPng(node,{width:1440,height: 1920})
		.then(function (dataUrl) {
			var link = document.createElement('a');
			link.download = "極星堂だより"+formatDateTime()+".png";
			link.href = dataUrl;
			link.click();
			node.style.zoom = 0.3;
			closeModalDialog("dialog-saving");
		});
	}
	function savePalette(){
		var node = document.querySelector("#out-palette");
		showModalDialog("dialog-saving");
		node.style.zoom = "unset";
		domtoimage.toPng(node,{width:1440,height: 1920})
		.then(function (dataUrl) {
			var link = document.createElement('a');
			link.download = ""+formatDateTime()+".png";
			link.href = dataUrl;
			link.click();
			// node.style.zoom = 0.3;
			closeModalDialog("dialog-saving");
		});
	}
	function HSVtoRGB( hue, saturation, value )
	{
		var C = value * saturation;
		var H = hue / 60;
		var X = C * ( 1 - Math.abs( H % 2 - 1 ) );
		
		var R = 0, G = 0, B = 0;
		switch( Math.floor( H ) )
		{
			case 0: R = C; G = X; B = 0; break;
			case 1: R = X; G = C; B = 0; break;
			case 2: R = 0; G = C; B = X; break;
			case 3: R = 0; G = X; B = C; break;
			case 4: R = X; G = 0; B = C; break;
			case 5: R = C; G = 0; B = X; break;
		}
		
		var m = value - C;
		var rgb = {
			R:Math.round( ( R + m ) * 255 ),
			G:Math.round( ( G + m ) * 255 ),
			B:Math.round( ( B + m ) * 255 )
		};
		
		rgb.code = [
		'#',
		( '00' + Number( rgb.R ).toString( 16 ) ).slice( -2 ),
		( '00' + Number( rgb.G ).toString( 16 ) ).slice( -2 ),
		( '00' + Number( rgb.B ).toString( 16 ) ).slice( -2 )
		].join( '' );
		
		return rgb;
	}
	function formatDateTime(){
		var date = new Date();
		var yy = date.getFullYear().toString().slice(-2);
		var M = date.getMonth() + 1;
		var MM = ("00" + M).slice(-2);
		var dd = ("00" + date.getDate()).slice(-2);
		var hh = ("00" + date.getHours()).slice(-2);
		var mm = ("00" + date.getMinutes()).slice(-2);
		var ss = ("00" + date.getSeconds()).slice(-2);
		return yy + MM + dd;
	}
