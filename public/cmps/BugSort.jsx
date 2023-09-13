

export function BugSort({ onSort, sortBy }) {


    function handleChange({ target }) {
        console.log(target.value);
        const value = target.value

        onSort(prevSort => ({ ...prevSort, key: value }))
    }

    function changeDir() {
        const newDir = sortBy.dir * -1
        console.log(newDir);
        onSort(prevSort => ({ ...prevSort, dir: newDir }))
    }

    function handleFormSubmit(ev){
        ev.preventDefault()
    }


    return (
        <form id="sort" onSubmit={handleFormSubmit}>
            <select onChange={handleChange} value={sortBy.key} name="sortoptions" id="sort">
                <option value=""></option>
                <option value="severity">severity</option>
                <option value="createdAt">createdAt</option>
                <option value="title">title</option>
            </select>
            <button onClick={changeDir}>{sortBy.dir===1? <i className="fa-solid fa-arrow-up"></i>: <i className="fa-solid fa-arrow-down"></i>}</button>
        </form>
    )
}