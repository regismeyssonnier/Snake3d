var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2 , Math.PI/2, 20, BABYLON.Vector3.Zero(), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    var mat = new BABYLON.StandardMaterial("mat", scene);
    var texture = new BABYLON.Texture("textures/albedo.png", scene);
    mat.diffuseTexture = texture;

    const eqTexture = new BABYLON.EquiRectangularCubeTexture('textures/equirectangular.jpg', scene, 2);

    const groundmat = new BABYLON.PBRMaterial("metalball", scene);
    groundmat.reflectionTexture = eqTexture;
    groundmat.refractionTexture = eqTexture;
    groundmat.microSurface = 1.0;
    groundmat.reflectivityColor = new BABYLON.Color3(0.05, 0.8, 0.86);
    groundmat.albedoColor = new BABYLON.Color3(0.06, 0.64, 0.79);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 20.5, width: 20.5, subdivisions: 10});
    ground.position.y -= 0.5;
    ground.material = groundmat;

    const bord1 = BABYLON.MeshBuilder.CreateBox("box", {});
    bord1.position.z -= 10.5;
    bord1.scaling =  new BABYLON.Vector3(20, 1, 1)
    bord1.material = groundmat;

    const bord2 = BABYLON.MeshBuilder.CreateBox("box", {});
    bord2.position.z += 10.5;
    bord2.scaling =  new BABYLON.Vector3(20, 1, 1)
    bord2.material = groundmat;

    const bord3 = BABYLON.MeshBuilder.CreateBox("box", {});
    bord3.position.x -= 10.5;
    bord3.scaling =  new BABYLON.Vector3(1, 1, 22)
    bord3.material = groundmat;

    const bord4 = BABYLON.MeshBuilder.CreateBox("box", {});
    bord4.position.x += 10.5;
    bord4.scaling =  new BABYLON.Vector3(1, 1, 22)
    bord4.material = groundmat;

    const metal = new BABYLON.PBRMaterial("metal", scene);
        metal.reflectionTexture = texture;
        metal.microSurface = 0.96;
        metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
        metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
        
    var fireMaterial = new BABYLON.StandardMaterial("fontainSculptur2", scene);
    var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, scene);
    fireMaterial.diffuseTexture = fireTexture;
    fireMaterial.opacityTexture = fireTexture;

    snake_list = [];
    //snake_list[0] = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 1, depth: 1});
    //snake_list[0].material = fireMaterial;

    const metalball = new BABYLON.PBRMaterial("metalball", scene);
    metalball.reflectionTexture = eqTexture;
    metalball.refractionTexture = eqTexture;
    metalball.microSurface = 1.0;
    metalball.reflectivityColor = new BABYLON.Color3(0.05, 0.8, 0.86);
    metalball.albedoColor = new BABYLON.Color3(0.06, 0.64, 0.79);
    
    
    Nb_ball = 40;
    balls = [];
    xb = -9.0;
    zb = 9.0;
    for(var i = 0;i < Nb_ball;i++){
        let ballMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 48, 1.0, scene);
        ballMetal.position.x = xb;
        ballMetal.position.z = zb;
        xb += 2;
        if(xb > 9.0){
            xb = -9.0;
            zb -= 5;
        }

        ballMetal.material = metalball;
        balls.push(ballMetal);
    }

    /**************keyborad */
    const dsm = new BABYLON.DeviceSourceManager(engine);
  


    /*********************************** */

    /*********************Text************ */
    // Create and configure textblock with instructions
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const controlsText = new BABYLON.GUI.TextBlock();
    controlsText.text = "Score : 0";
    controlsText.color = "white";
    controlsText.fontStyle = "bold";
    controlsText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    controlsText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    controlsText.fontSize = 24;
    advancedTexture.addControl(controlsText);

    //win
    const winText = new BABYLON.GUI.TextBlock();
    winText.text = "Gagné";
    winText.color = "white";
    winText.fontStyle = "bold";
    winText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    winText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    winText.fontSize = 50;

    const loseText = new BABYLON.GUI.TextBlock();
    loseText.text = "Perdu";
    loseText.color = "white";
    loseText.fontStyle = "bold";
    loseText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    loseText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    loseText.fontSize = 50;

    /******************************************** */

    /*********************game variable ****** */
    snake_speed = 0.01;
    snake_block = 1.01; 
    snake_X = 0;
    snake_Z = 0;
    SX = 0;
    SZ = 2;
    LR = 0;
    HB = 0;
    var hl = new BABYLON.HighlightLayer("hl1", scene);
    let Length_snake = 1;
    lastt = 0;
    startt = Date.now();
    let game_play = true;
    score = 0;
    score_ball = 100;
    count_ball = 0;
    max_ball = 40;
    let win = 0;
    restart = 1;
    /**************************************** */

    scene.registerBeforeRender(() => {
        if(game_play){
            if(Date.now() - lastt >= 100){
                SX += snake_X;
                SZ += snake_Z;
                _snake = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 1, depth: 1});
                _snake.material = fireMaterial;
                
                _snake.position.x = SX;
                _snake.position.z = SZ;
                snake_list.push(_snake);
                lastt = Date.now();
            }
            
            //console.log('play');
            
            //if(Length_snake < 10)
            if(snake_list.length > Length_snake){
                scene.removeMesh(snake_list[0]);
                snake_list[0].dispose();
                snake_list.shift();
                //console.log(snake_list.length + ' ' + Length_snake)
            }
            
            
            if(SX >= 9.5 || SX <= -9.5 ||
            SZ >= 9.5 || SZ <= -9.5 ){
                game_play = false;
                advancedTexture.addControl(loseText);
                win = 0;
                for(var j = 0;j < balls.length;j++){
                    if(balls[j] != null){
                        balls[j].dispose();
                        balls[j] = null;
                    }
                }
            }

        }
        

        if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard)) {
            if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(90) == 1) {
                snake_Z = snake_block;
                snake_X = 0;
                LR = 0;
                HB = 1;
                if(restart){
                    startt = Date.now();
                    restart = 0;
                }
            }
            if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(83) == 1) {
                snake_Z = -snake_block;
                snake_X = 0;
                LR = 0;
                HB = 1;
            }
            if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(81) == 1) {
                snake_X = -snake_block;
                 snake_Z = 0;
                LR = 1;
                HB = 0;
            }
            if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(68) == 1) {
                snake_X = snake_block;
                snake_Z = 0;
                LR = 1;
                HB = 0;
            }
            if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(32) == 1) {
                snake_X = 0;
                snake_Z = 0;
                LR = 0;
                HB = 0;
            }
            if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(82) == 1) {
                if(game_play == false){
                    game_play = true;
                    if(win)
                        advancedTexture.removeControl(winText);
                    else
                        advancedTexture.removeControl(loseText);
                    SX = 0;SZ = 2;
                    balls = [];
                    xb = -9.0;
                    zb = 9.0;
                    for(var i = 0;i < Nb_ball;i++){
                        let ballMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 48, 1.0, scene);
                        ballMetal.position.x = xb;
                        ballMetal.position.z = zb;
                        xb += 2;
                        if(xb > 9.0){
                            xb = -9.0;
                            zb -= 5;
                        }

                        ballMetal.material = metalball;
                        balls.push(ballMetal);
                    }

                    for(var i = 0;i < snake_list.length;i++){
                        snake_list[i].dispose();
                        snake_list[i] = null;
                                                

                    }

                    snake_list = [];
                    snake_X = 0;
                    snake_Z = 0;

                    score = 0;

                    Length_snake = 1;
                    count_ball = 0;
                    restart = 1;
                }
            }
        }

    });

   
    scene.registerAfterRender(()=>{
        

        
        if(game_play){
            
            if(snake_list[snake_list.length-1] != null){
                for(var j = 0;j < balls.length;j++){
               
                    if(balls[j] != null){
                        if (snake_list[snake_list.length-1].intersectsMesh(balls[j], false)) {
                            /*for(var i = snake_list.length-1;i >= 0;i--)
                                hl.addMesh(snake_list[i], BABYLON.Color3.Green());*/
                        //ballMetal.setEnabled(false);
                            balls[j].dispose();
                            balls[j] = null;
                            Length_snake+=1;
                            score += score_ball;
                            controlsText.text = "Score : " + score;
                            count_ball++;
                            if(count_ball == max_ball){
                                game_play = false;
                                advancedTexture.addControl(winText);
                                win = 1;
                                t = (Date.now()-startt);
                                bonust = t > 50000 ? 50000 : t;
                                console.log(t);
                                score += Math.floor((50000-bonust)*30000/100000);
                                controlsText.text = "Score : " + score;

                            }
                        //ballMetal.isVisible = false;
                            //scene.removeMesh(ballMetal);
                            
                        }/*else {
                            for(var i = 0;i < snake_list.length;i++)
                                setTimeout(()=>{hl.removeMesh(snake_list[i]);},100);
                            
                        }*/

                    }

                }
            }

            for(var i = 0;i < snake_list.length-1;i++){
                
                    if (snake_list[snake_list.length-1].intersectsMesh(snake_list[i], false)){
                        game_play = false;
                        advancedTexture.addControl(loseText);
                        win = 0;
                        for(var j = 0;j < balls.length;j++){
                            if(balls[j] != null){
                                balls[j].dispose();
                                balls[j] = null;
                            }
                        }
                        //console.log(snake_list.length + ' ' + Length_snake);
                    }


            }

    
        }
        

        

    });





    return scene;
};
