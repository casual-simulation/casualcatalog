//pull down file data
if (!that.url)
{
    return "no file url supplied";
}

let data = await os.getFile(that.url);

return data;