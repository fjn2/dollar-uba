import React, { useEffect, useState } from 'react';
import { View } from 'react-native'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'


function getData() {
  return fetch('http://localhost:3030')
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
}

const parseData = (dataFromApi) => {
  const dollarLine = [];
  const ubaLine = [];
  const xAxis = [];
  Object.keys(dataFromApi).map((key, index) => {
    if (index % 50 === 0) {
      xAxis.push(key);
    }

    dollarLine.push(dataFromApi[key].dollar);
    ubaLine.push(dataFromApi[key].uba);
  })
  return {
    xAxis,
    points: [
    {
      data: dollarLine,
      svg:  { stroke: '#8800cc' }
    }, {
      data: ubaLine,
      svg:  { stroke: 'red' }
    }
  ]}
};

const AnatomyExample = () => {
  const [data, setData] = useState([])
  const [xAxisData, setXAxisData] = useState([])


  useEffect(() => {
    getData().then(parseData).then(({ points, xAxis }) => {
      setData(points);
      setXAxisData(xAxis);
    })
  }, []);

  const contentInset = { top: 20, bottom: 20 }

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent>
            <Icon name='menu' />
          </Button>
        </Left>
        <Body>
          <Title>Header</Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ height: 200, width: '100%' }}>
        <YAxis
          data={[1,2,3]}
          // contentInset={contentInset}
          svg={{
              fill: 'grey',
              fontSize: 10,
          }}
          formatLabel={(value) => {
            console.log('value', value)
            return `${value}ºC`
          }}
          contentInset={contentInset}
          // svg={{ fontSize: 10, fill: 'black' }}
        />
        <LineChart
            style={{ height: 200 }}
            data={data}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={contentInset}
        >
          <Grid />
        </LineChart>
        <XAxis
          data={xAxisData}
          formatLabel={(value, index) => {
            return xAxisData[index];
          }}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10, fill: 'black' }}
        />
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Text>Footer</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

export default AnatomyExample;
