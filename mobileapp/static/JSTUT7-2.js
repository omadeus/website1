// Reference to the canvas element
let canvas;
// Context provides functions used for drawing and
// working with Canvas
let ctx;
// Stores previously drawn image data to restore after
// new drawings are added
let savedImageData;
// Stores whether I'm currently dragging the mouse
let dragging = false;
let strokeColor = 'red';
let strokeColor2 = 'orange';
let strokeColor3 = 'yellow';
let strokeColor4 = 'green';
let strokeColor5 = 'blue';
let strokeColor6 = 'darkblue';
let strokeColor7 = 'violet';
let fillColor = 'black';
let line_Width = 1;
let polygonSides = 6;
// Tool currently using
let canvasWidth = 600;
let canvasHeight = 350;



// Stores size data used to create rubber band shapes
// that will redraw as the user moves the mouse
class ShapeBoundingBox{
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

// Holds x & y position where clicked
class MouseDownPos{
    constructor(x,y) {
        this.x = x,
        this.y = y;
    }
}

// Holds x & y location of the mouse
class Location{
    constructor(x,y) {
        this.x = x,
        this.y = y;
    }
}

// Holds x & y polygon point values
class PolygonPoint{
    constructor(x,y) {
        this.x = x,
        this.y = y;
    }
}
// Stores top left x & y and size of rubber band box
let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
// Holds x & y position where clicked
let mousedown = new MouseDownPos(0,0);
// Holds x & y location of the mouse
let loc = new Location(0,0);

// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    // Get reference to canvas element
    canvas = document.getElementById('my-canvas');
    // Get methods for manipulating the canvas
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = line_Width;
    // Execute ReactToMouseDown when the mouse is clicked
    canvas.addEventListener("mousedown", ReactToMouseDown);
    // Execute ReactToMouseMove when the mouse is clicked
    canvas.addEventListener("mousemove", ReactToMouseMove);
    // Execute ReactToMouseUp when the mouse is clicked
    canvas.addEventListener("mouseup", ReactToMouseUp);
}

function f1(color){
    if (color == 'red'){
        document.getElementById('red_inputs').style.display = "block";
        document.getElementById('orange_inputs').style.display = "none";
        document.getElementById('yellow_inputs').style.display = "none";
        document.getElementById('green_inputs').style.display = "none";
        document.getElementById('blue_inputs').style.display = "none";
        document.getElementById('indigo_inputs').style.display = "none";
        document.getElementById('violet_inputs').style.display = "none";
    } else if (color == 'orange') {
        document.getElementById('red_inputs').style.display = "none";
        document.getElementById('orange_inputs').style.display = "block";
        document.getElementById('yellow_inputs').style.display = "none";
        document.getElementById('green_inputs').style.display = "none";
        document.getElementById('blue_inputs').style.display = "none";
        document.getElementById('indigo_inputs').style.display = "none";
        document.getElementById('violet_inputs').style.display = "none";
    } else if (color == 'yellow') {
        document.getElementById('red_inputs').style.display = "none";
        document.getElementById('orange_inputs').style.display = "none";
        document.getElementById('yellow_inputs').style.display = "block";
        document.getElementById('green_inputs').style.display = "none";
        document.getElementById('blue_inputs').style.display = "none";
        document.getElementById('indigo_inputs').style.display = "none";
        document.getElementById('violet_inputs').style.display = "none";
    } else if (color == 'green') {
        document.getElementById('red_inputs').style.display = "none";
        document.getElementById('orange_inputs').style.display = "none";
        document.getElementById('yellow_inputs').style.display = "none";
        document.getElementById('green_inputs').style.display = "block";
        document.getElementById('blue_inputs').style.display = "none";
        document.getElementById('indigo_inputs').style.display = "none";
        document.getElementById('violet_inputs').style.display = "none";
    } else if (color == 'blue') {
        document.getElementById('red_inputs').style.display = "none";
        document.getElementById('orange_inputs').style.display = "none";
        document.getElementById('yellow_inputs').style.display = "none";
        document.getElementById('green_inputs').style.display = "none";
        document.getElementById('blue_inputs').style.display = "block";
        document.getElementById('indigo_inputs').style.display = "none";
        document.getElementById('violet_inputs').style.display = "none";
    } else if (color == 'indigo') {
        document.getElementById('red_inputs').style.display = "none";
        document.getElementById('orange_inputs').style.display = "none";
        document.getElementById('yellow_inputs').style.display = "none";
        document.getElementById('green_inputs').style.display = "none";
        document.getElementById('blue_inputs').style.display = "none";
        document.getElementById('indigo_inputs').style.display = "block";
        document.getElementById('violet_inputs').style.display = "none";
    } else if (color == 'violet') {
        document.getElementById('red_inputs').style.display = "none";
        document.getElementById('orange_inputs').style.display = "none";
        document.getElementById('yellow_inputs').style.display = "none";
        document.getElementById('green_inputs').style.display = "none";
        document.getElementById('blue_inputs').style.display = "none";
        document.getElementById('indigo_inputs').style.display = "none";
        document.getElementById('violet_inputs').style.display = "block";
    }
}


function ChangeTool(toolClicked){
    document.getElementById("open").className = "";
    document.getElementById("save").className = "";
    document.getElementById("rectangle_1").className = "";
    document.getElementById("line").className = "";
    document.getElementById("rectangle").className = "";
    document.getElementById("circle").className = "";
    document.getElementById("ellipse").className = "";
    document.getElementById("polygon").className = "";
    document.getElementById("violet").className = "";
    // Highlight the last selected tool on toolbar
    document.getElementById(toolClicked).className = "selected";
    // Change current tool used for drawing
    currentTool = toolClicked;
}
// Returns mouse x & y position based on canvas position in page
function GetMousePosition(x,y){
    // Get canvas size and position in web page
    let canvasSizeData = canvas.getBoundingClientRect();
    return { x: (x - canvasSizeData.left) * (canvas.width  / canvasSizeData.width),
        y: (y - canvasSizeData.top)  * (canvas.height / canvasSizeData.height)
      };
}

function SaveCanvasImage(){
    // Save image
    savedImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}

function RedrawCanvasImage(){
    // Restore image
    ctx.putImageData(savedImageData,0,0);
}

function UpdateRubberbandSizeData(loc){
    // Height & width are the difference between were clicked
    // and current mouse position
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    // If mouse is below where mouse was clicked originally
    if(loc.x > mousedown.x){

        // Store mousedown because it is farthest left
        shapeBoundingBox.left = mousedown.x;
    } else {

        // Store mouse location because it is most left
        shapeBoundingBox.left = loc.x;
    }

    // If mouse location is below where clicked originally
    if(loc.y > mousedown.y){

        // Store mousedown because it is closer to the top
        // of the canvas
        shapeBoundingBox.top = mousedown.y;
    } else {

        // Otherwise store mouse position
        shapeBoundingBox.top = loc.y;
    }
}

// Returns the angle using x and y
// x = Adjacent Side
// y = Opposite Side
// Tan(Angle) = Opposite / Adjacent
// Angle = ArcTan(Opposite / Adjacent)
function getAngleUsingXAndY(mouselocX, mouselocY){
    let adjacent = mousedown.x - mouselocX;
    let opposite = mousedown.y - mouselocY;

    return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad){
    if(rad < 0){
        // Correct the bottom error by adding the negative
        // angle to 360 to get the correct result around
        // the whole circle
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}

// Converts degrees to radians
function degreesToRadians(degrees){
    return degrees * (Math.PI / 180);
}

function getPolygonPoints(){
    // Get angle in radians based on x & y of mouse location
    let angle =  degreesToRadians(getAngleUsingXAndY(loc.x, loc.y));

    // X & Y for the X & Y point representing the radius is equal to
    // the X & Y of the bounding rubberband box
    let radiusX = shapeBoundingBox.width;
    let radiusY = shapeBoundingBox.height;
    // Stores all points in the polygon
    let polygonPoints = [];

    // Each point in the polygon is found by breaking the
    // parts of the polygon into triangles
    // Then I can use the known angle and adjacent side length
    // to find the X = mouseLoc.x + radiusX * Sin(angle)
    // You find the Y = mouseLoc.y + radiusY * Cos(angle)
    for(let i = 0; i < polygonSides; i++){
        polygonPoints.push(new PolygonPoint(loc.x + radiusX * Math.sin(angle),
        loc.y - radiusY * Math.cos(angle)));

        // 2 * PI equals 360 degrees
        // Divide 360 into parts based on how many polygon
        // sides you want
        angle += 2 * Math.PI / polygonSides;
    }
    return polygonPoints;
}

// Get the polygon points and draw the polygon
function getPolygon(){
    let polygonPoints = getPolygonPoints();
    ctx.beginPath();
    ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for(let i = 1; i < polygonSides; i++){
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    ctx.closePath();
}

// Called to draw the line
function drawRubberbandShape(loc){
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    if(currentTool === "rectangle_1"){
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "line"){
        ctx.strokeStyle = strokeColor2;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "rectangle"){
        // Creates rectangles
        ctx.strokeStyle = strokeColor3;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "circle"){
        // Create circles

        ctx.strokeStyle = strokeColor4;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "ellipse"){
        // Create ellipses
        // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
        ctx.strokeStyle = strokeColor5;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "polygon"){
        // Create polygons
        ctx.strokeStyle = strokeColor6;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "violet"){
        // Create polygons
        ctx.strokeStyle = strokeColor7;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    }
}

function UpdateRubberbandOnMove(loc){
    // Stores changing height, width, x & y position of most
    // top left point being either the click or mouse location
    UpdateRubberbandSizeData(loc);

    // Redraw the shape
    drawRubberbandShape(loc);
}

// Store each point as the mouse moves and whether the mouse
// button is currently being dragged
function AddBrushPoint(x, y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    // Store true that mouse is down
    brushDownPos.push(mouseDown);
}

// Cycle through all brush points and connect them with lines
function DrawBrush(){
    for(let i = 1; i < brushXPoints.length; i++){
        ctx.beginPath();

        // Check if the mouse button was down at this point
        // and if so continue drawing
        if(brushDownPos[i]){
            ctx.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
        } else {
            ctx.moveTo(brushXPoints[i]-1, brushYPoints[i]);
        }
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

function ReactToMouseDown(e){
    // Change the mouse pointer to a crosshair
    canvas.style.cursor = "crosshair";
    // Store location
    loc = GetMousePosition(e.clientX, e.clientY);
    // Save the current canvas image
    SaveCanvasImage();
    // Store mouse position when clicked
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    // Store that yes the mouse is being held down
    dragging = true;

    // Brush will store points in an array
    if(currentTool === 'brush'){
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
};

function ReactToMouseMove(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    // If using brush tool and dragging store each point
    if(currentTool === 'brush' && dragging && usingBrush){
        // Throw away brush drawings that occur outside of the canvas
        if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
            AddBrushPoint(loc.x, loc.y, true);
        }
        RedrawCanvasImage();
        DrawBrush();
    } else {
        if(dragging){
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    }
};

function ReactToMouseUp(e){
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}

// Saves the image in your default download directory
function SaveImage(){
    // Get a reference to the link element
    const csrf = document.getElementsByName('csrfmiddlewaretoken')
   	var canvas = document.getElementById('my-canvas');
    canvas.toBlob( (blob) => {
        const file = new File([blob], "photo.png");
        const dT = new DataTransfer();
        dT.items.add( file );
        document.getElementById( "file-input" ).files = dT.files;
    });
    let formData = new FormData();
    formData.append('csrfmiddlewaretoken', csrf[0].value);
    formData.append('mother_1', document.getElementById('mother_1').value);
    formData.append('mother_2', document.getElementById('mother_2').value);
    formData.append('mother_3', document.getElementById('mother_3').value);
    formData.append('mother_4', document.getElementById('mother_4').value);
    formData.append('mother_5', document.getElementById('mother_5').value);
    formData.append('mother_6', document.getElementById('mother_6').value);
    formData.append('red_1', document.getElementById('red_1').value);
    formData.append('red_2', document.getElementById('red_2').value);
    formData.append('red_3', document.getElementById('red_3').value);
    formData.append('red_4', document.getElementById('red_4').value);
    formData.append('red_5', document.getElementById('red_5').value);
    formData.append('red_6', document.getElementById('red_6').value);
    formData.append('red_7', document.getElementById('red_7').value);
    formData.append('red_8', document.getElementById('red_8').value);
    formData.append('orange_1', document.getElementById('orange_1').value);
    formData.append('orange_2', document.getElementById('orange_2').value);
    formData.append('orange_3', document.getElementById('orange_3').value);
    formData.append('orange_4', document.getElementById('orange_4').value);
    formData.append('orange_5', document.getElementById('orange_5').value);
    formData.append('orange_6', document.getElementById('orange_6').value);
    formData.append('orange_7', document.getElementById('orange_7').value);
    formData.append('orange_8', document.getElementById('orange_8').value);
    formData.append('yellow_1', document.getElementById('yellow_1').value);
    formData.append('yellow_2', document.getElementById('yellow_2').value);
    formData.append('yellow_3', document.getElementById('yellow_3').value);
    formData.append('yellow_4', document.getElementById('yellow_4').value);
    formData.append('yellow_5', document.getElementById('yellow_5').value);
    formData.append('yellow_6', document.getElementById('yellow_6').value);
    formData.append('yellow_7', document.getElementById('yellow_7').value);
    formData.append('yellow_8', document.getElementById('yellow_8').value);
    formData.append('green_1', document.getElementById('green_1').value);
    formData.append('green_2', document.getElementById('green_2').value);
    formData.append('green_3', document.getElementById('green_3').value);
    formData.append('green_4', document.getElementById('green_4').value);
    formData.append('green_5', document.getElementById('green_5').value);
    formData.append('green_6', document.getElementById('green_6').value);
    formData.append('green_7', document.getElementById('green_7').value);
    formData.append('green_8', document.getElementById('green_8').value);
    formData.append('blue_1', document.getElementById('blue_1').value);
    formData.append('blue_2', document.getElementById('blue_2').value);
    formData.append('blue_3', document.getElementById('blue_3').value);
    formData.append('blue_4', document.getElementById('blue_4').value);
    formData.append('blue_5', document.getElementById('blue_5').value);
    formData.append('blue_6', document.getElementById('blue_6').value);
    formData.append('blue_7', document.getElementById('blue_7').value);
    formData.append('blue_8', document.getElementById('blue_8').value);
    formData.append('indigo_1', document.getElementById('indigo_1').value);
    formData.append('indigo_2', document.getElementById('indigo_2').value);
    formData.append('indigo_3', document.getElementById('indigo_3').value);
    formData.append('indigo_4', document.getElementById('indigo_4').value);
    formData.append('indigo_5', document.getElementById('indigo_5').value);
    formData.append('indigo_6', document.getElementById('indigo_6').value);
    formData.append('indigo_7', document.getElementById('indigo_7').value);
    formData.append('indigo_8', document.getElementById('indigo_8').value);
    formData.append('violet_1', document.getElementById('violet_1').value);
    formData.append('violet_2', document.getElementById('violet_2').value);
    formData.append('violet_3', document.getElementById('violet_3').value);
    formData.append('violet_4', document.getElementById('violet_4').value);
    formData.append('violet_5', document.getElementById('violet_5').value);
    formData.append('violet_6', document.getElementById('violet_6').value);
    formData.append('violet_7', document.getElementById('violet_7').value);
    formData.append('violet_8', document.getElementById('violet_8').value);


    $.ajax({
        contentType: 'multipart/form-data',
        url: 'save',
        data: formData,
        processData: false,
        contentType: false,
        method: 'POST',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRFToken', csrftoken)},
        success: function(json) {
            if (json.result) {
                document.getElementById('submit').click()
            }
            }
    })
    // document.getElementById('submit').click()
}

function OpenImage(){
    document.getElementById('input_file').click()
    document.getElementById('rectangle_1').click()

}

function loadImage() {
  var input, file, reader, img;

  input = document.querySelector('input');

  file = input.files[0];
  reader = new FileReader();
  reader.onload = drawImage;
  reader.readAsDataURL(file);


function drawImage() {
img = new Image();
img.onload = function() {
  var canvas = document.getElementById("my-canvas")
  canvas.width = 600;
  canvas.height = 350;
  img_dh = img.height
  img_wh = img.width
  dh = (img_dh-350) / (img_dh / 100)
  dw = (img_wh / 100) * (100 - dh)
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, dw, 350);
}
img.src = reader.result;
}
}