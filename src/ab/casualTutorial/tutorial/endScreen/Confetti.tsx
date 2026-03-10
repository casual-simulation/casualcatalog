const Confetti = () => {
    let numberArr = []

    for (var i = 0; i < 149; i++) {
        numberArr.push(i)
    }
    
    return (
        <>{numberArr.map(num => <div className={`confetti-${num}`} />)}</>
    )
}

return Confetti