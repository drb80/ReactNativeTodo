import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';

const Items = props => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      const b = await fetch('http://localhost:3000/items.json');
      const c = await b.json();
      setData(c);
    }
    getData();
  }, []);

  function tableData(item) {
    return (
      <>
        <td>{item.what}</td>
        <td>{item.when}</td>
      </>
    );
  }
  
  function tableRow(item) {
    return (
      <tr key={item.id}>
        { tableData(item) }
      </tr>
    );
  }  
  
  return (
    <table border="1px">
      <tbody>
        { data && data.map(item => tableRow (item)) }
      </tbody>
    </table>
  );
}

const App = () => {
  return (
    <ScrollView>
      <Items/>
    </ScrollView>
  );
};

export default App;
