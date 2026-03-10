//discoverable
const discoverableResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/discoverables?pagination[start]=0&pagination[limit]=100',
    headers:
    {
        "Authorization": "Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07"
    }
})
tags.discoverableData = (discoverableResponse.data.data).sort((a, b) => a.id - b.id);