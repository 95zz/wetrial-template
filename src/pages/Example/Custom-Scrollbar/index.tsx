import React from 'react';
import { Card, List } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const data = [
  {
    title: 'Peppa Pig 1',
  },
  {
    title: 'Peppa Pig 2',
  },
  {
    title: 'Peppa Pig 3',
  },
  {
    title: 'Peppa Pig 4',
  },
  {
    title: 'Peppa Pig 5',
  },
  {
    title: 'Peppa Pig 6',
  },
  {
    title: 'Peppa Pig 7',
  },
  {
    title: 'Peppa Pig 8',
  },
  {
    title: 'Peppa Pig 9',
  },
  {
    title: 'Peppa Pig 10',
  },
  {
    title: 'Peppa Pig 11',
  },
  {
    title: 'Peppa Pig 12',
  },
];

class CustomScrollbar extends React.Component {
  private myScrollbars: any;

  handleUpdate = values => {
    const { top } = values;
    if (top === 1) {
      console.log('已到达最底部');
    } else if (top === 0) {
      console.log('已到达最顶部');
    }
  };

  handleScrollStop = () => {
    console.log(this.myScrollbars.getScrollTop());
  };

  ScrollTop = () => {
    this.myScrollbars.scrollToTop();
  };

  render() {
    return (
      <div>
        <Card>
          <a onClick={this.ScrollTop}>回到顶部</a>
          <Scrollbars
            autoHide
            thumbMinSize={50}
            style={{ height: 'Calc( 100vh - 280px)' }}
            onUpdate={this.handleUpdate}
            onScrollStop={this.handleScrollStop}
            ref={Scrollbars => {
              this.myScrollbars = Scrollbars;
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="">{item.title}</a>}
                    description="If you don’t yet use npm or a modern module bundler, and would rather prefer a single-file UMD build that makes ReactCustomScrollbars available as a global object, you can grab a pre-built version from unpkg. We don’t recommend this approach for any serious application, as most of the libraries complementary to react-custom-scrollbars are only available on npm."
                  />
                </List.Item>
              )}
            />
            ,
          </Scrollbars>
        </Card>
      </div>
    );
  }
}

export default CustomScrollbar;
