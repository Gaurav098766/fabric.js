const canvas = new fabric.Canvas('canvas',{
    width:500,
    height:500,
});



// making new independent functions
const initCanvas = (id) =>{     // for object parameter pass the id and hav this function return thr canvas object that is created
    return new fabric.Canvas(id,{
        width:500,
        height:500,
        selection:false  // to remove the highlighting of the mouse cursor
    })
}

// making a new independent function for setting a background image
const setBackground = (url,canvas) =>{
        fabric.Image.fromURL(url,(img)=> {  // using fabric js function fromURL(url,image) 
        canvas.backgroundImage= img;     // targeting backgroundImage with img;
        canvas.requestRenderAll();
    })
}



const toggleMode = (mode) =>{

    if(mode === modes.pan){
        if(currentMode === modes.pan){    // basic variable currentMode  
            currentMode = '';
        }else{
            currentMode = modes.pan;
            canvas.isDrawingMode = false       // isDrawing mode enable us to do free drawing on the canvas container.
            canvas.requestRenderAll();
        }
    }
    else if(mode === modes.drawing){
        if(currentMode === modes.drawing){
            currentMode = '';
            canvas.isDrawingMode = false
            canvas.requestRenderAll();
        }
        else{

            // METHOD:1 (for coloring and brush formats)


            // canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);    // fabric.SprayBrush(canvas object) is a inbuilt function in which we can change the format of brushes such as SprayBrush,CircleBrush etc. 
            // canvas.freeDrawingBrush.color = 'red';
            // canvas.freeDrawingBrush.width = 15;


            // METHOD:2 (Importing from html file)
            currentMode = modes.drawing;
            canvas.freeDrawingBrush.color = color;
            canvas.isDrawingMode = true
            canvas.requestRenderAll();
        }
    }
} 

const setPanEvents = (canvas) =>{
    // mouse:move
    canvas.on('mouse:move',(event) =>{
    if(mousePressed && currentMode === modes.pan){
        canvas.setCursor('grab');  // setting up setCursor() so that when we move or mouse downwards the crosshair cursor pointer should appear.
        canvas.requestRenderAll();
        const mEvent = event.e;
        const delta = new fabric.Point(mEvent.movementX,mEvent.movementY) // making a constant delta to make use of mEvent with respect to movementX and movementY
        canvas.relativePan(delta);
    }
})


// to keep track of mouse down/up
    canvas.on('mouse:down',(event) =>{
    mousePressed = true      // setting the boolean as per our requirement
    if(currentMode === modes.pan){      
        canvas.setCursor('grab');  // setting up setCursor() so that when we move or mouse downwards the crosshair cursor pointer should appear.
        canvas.requestRenderAll();
    }

})

canvas.on('mouse:up',(event) =>{
    mousePressed = false       // setting the boolean as per our requirement
    canvas.setCursor('default');  // setting up setCursor() so that when we move mouse upwards the crosshair cursor pointer should appear.
    canvas.requestRenderAll();

})
}

const setColorListener = () =>{                           // function to get desirable color of users choice
    const picker = document.getElementById                // color picking/differentiaiting by id
    ('colorPicker')
    picker.addEventListener('change',(event) =>{
        console.log(event.target.value);
        color =  event.target.value
        canvas.freeDrawingBrush.color = color;
        canvas.requestRenderAll();
    })

}

const clearCanvas = (canvas) =>{                   // clearCanvas is defined to remove all the drawing or images from the background 
    canvas.getObjects().forEach((o) =>{            // Retrieving/Classifying objects to make them ready for removal.   
        if(o !== canvas.backgroundImage){ 
            canvas.remove(o);                      // function to  remove canvas image
        }
    })
}

const imgAdded = (e) =>{                                                  // defining varaible of adding images
    console.log(e)                                                   // Selecting image by ID and having object name as myImg 
    const inputElem = document.getElementById('myImg');             // 
    const file = (inputElem.files[0]);
    reader.readAsDataURL(file);                                   // JS inbilt function to read data as URL
}

const canvasInit = initCanvas('canvas');  //calling the initCanvas function. 

let mousePressed = false;
let color = '#000000';

let currentMode;
const modes = {
    pan:'pan',
    drawing: 'drawing'
}

const inputFile = document.getElementById('myImg')   // selecting file to display on canvas by id
inputFile.addEventListener('change',imgAdded);


const reader = new FileReader();                  // Selecting the file to be displayed
reader.addEventListener("load",() =>{
    fabric.Image.fromURL(reader.result,img =>{      // fabric js syntax to select image from URL
        canvas.add(img);
        canvas.requestRenderAll();
    })
})

fabric.Image.fromURL(reader.result,img =>{
    canvas.add(img);
    canvas.requestRenderAll();
},

canvas.on('mouse:wheel', (opt)=> {
  var delta = opt.e.deltaY;
  var pointer = canvas.getPointer(opt.e);
  var zoom = canvas.getZoom();                   // Inbuild fabric js function to return the current zoom level of the object.
  zoom = zoom + delta/200;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  reiniciarZoom();
  opt.e.preventDefault();
  opt.e.stopPropagation();
}));


setBackground('https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8c29saWQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',canvas);
setPanEvents(canvas);
setColorListener();

