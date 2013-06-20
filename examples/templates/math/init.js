$(function(){
	var myJOBAD = new JOBAD($(".ltx_page_main"));

	//TODO: Load modules here
	myJOBAD.Setup.enable();

	//Fold all ltx sections. 
	myJOBAD.enableFolding($("div.ltx_section"), {
		"preview": function(element){
			return element.find(".ltx_title").eq(0).clone();
		}
	});

	myJOBAD.enableFolding($("div.ltx_para"), {"preview": "Paragraph", "height": 20});

	myJOBAD.enableFolding(myJOBAD.element, {
		"preview": $("#idp32240").clone(),
		"autoFold": true
	})
})