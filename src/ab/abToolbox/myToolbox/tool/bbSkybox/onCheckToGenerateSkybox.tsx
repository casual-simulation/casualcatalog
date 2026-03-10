//This code check for existing skybox, if there is an existing skybox. It won't generate.   
let existingSkybox = getBot("name","skybox");

if(existingSkybox!=null) return;

thisBot.generateSkybox();   