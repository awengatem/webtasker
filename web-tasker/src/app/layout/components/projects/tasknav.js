let tabLinks = document.querySelectorAll(".idance .schedule .content-block .container .timetable .nav .nav-tabs a");
let tabPanels = document.querySelectorAll(".idance .schedule .content-block .container .timetable .tab-content");

function showPanel(panelIndex,colorCode){
    tabLinks.forEach(node=>{
        node.style.backgroundColor = "";
        node.style.color = "";
    });
    tabLinks[panelIndex].style.backgroundColor=colorCode;
    tabLinks[panelIndex].style.color = "white";

    tabPanels.forEach(node=>{
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display="block";
    tabPanels[panelIndex].style.backgroundColor=colorCode;
}
