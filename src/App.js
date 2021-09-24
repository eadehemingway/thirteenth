import React from "react";
import { Timeline } from './Timeline'
import styled from "styled-components";
import { svgWidth } from './Timeline/variables'


function App() {
  return (
    <Container>
        <Title> 13TH </Title>
        <Timeline />

    </Container>
  );
}

const Title = styled.h1`
font-family: Yaldevi;
color: transparent;
font-size: 13rem;
margin: 0;
margin-top: 50px;
background-color: coral;
background-image: url("https://www.transparenttextures.com/patterns/asfalt-light.png");
background-clip: text;
-webkit-background-clip: text;
`

const Container = styled.div`
max-width: ${svgWidth}px;
margin:auto;

`

export default App;
