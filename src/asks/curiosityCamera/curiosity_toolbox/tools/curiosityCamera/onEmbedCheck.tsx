// check if tmurl exists
const urlObj = new URL(configBot.tags.url);
const teachableParam = urlObj.searchParams.get("tmurl"); 

if(teachableParam && teachableParam != ""){
	// swap to teachable machine mode
    tags.processingMode = 'teachableMachine';
}