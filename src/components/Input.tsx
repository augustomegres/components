import React from "react";
import MaskInput from "react-input-mask";

export interface InputProps {

  /**
   * **O título irá aparecer acima de seu input.**
   * 
   * - Este deverá ser do tipo string
   * - Não obrigatório
   *
   */
  title?: string;



  /**
   * **Define um padrão para o input**
   * 
   * Por exemplo, se você precisa de preencher uma data, insira o mask "99/99/9999" e 
   * o input impedirá o preenchimento de dados fora do padrão.
   * * `9`: `0-9`
   * * `a`: `A-Z, a-z`
   * * `\*`: `A-Z, a-z, 0-9`
   * 
   * _Saiba mais em: https://github.com/sanniassin/react-input-mask_
   */
  mask?: string;


  /**
   * **É como um caractere temporário enquando você ainda não digitou o valor**
   * 
   * Por exemplo, se você inseriu um underline ('_'), seu input de data aparecerá como 
   * __/__/____ até que o mesmo seja preenchido
   * 
   * _Saiba mais em: https://github.com/sanniassin/react-input-mask_
   */
  maskPlaceholder?: string;

  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = (props) => {
  return (
    <div className={`_input${" " + props.className || ""}`}>
      <label htmlFor="input" className="title">
        {props.title} {props.required && "*"}
      </label>
      <MaskInput {...props} className="input" maskPlaceholder={props.maskPlaceholder} mask={props.mask || ""} />
    </div>
  );
};

export default Input;
