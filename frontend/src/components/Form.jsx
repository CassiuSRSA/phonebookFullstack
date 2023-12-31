const Form = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name:{" "}
        <input value={props.nameValue} onChange={props.onNameChange} required />
      </div>
      <div>
        number:{" "}
        <input
          value={props.numberValue}
          onChange={props.onNumberChange}
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default Form;
