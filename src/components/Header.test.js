import React from "react";
import { render } from "@testing-library/react"
import Header from "./Header";
import ItemList from "./ItemList"

test("Input value is rendered when the form is submitted", () => {
    //Arrage
    const {getByTestId} = render(<Header />, <ItemList />)

    const input = getByTestId("input");
    const button = getByTestId("button");
    const list = getByTestId("listSearch");

    const InputValue = "Apple";

    // Act
    input.value = InputValue
    button.click();

    //Assert
    expect(list.length).not.toBeLessThan(0)
})