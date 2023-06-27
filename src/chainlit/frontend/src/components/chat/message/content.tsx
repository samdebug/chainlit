import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography, Link, Stack, Box } from '@mui/material';
import { IElements } from 'state/element';
import { memo } from 'react';
import { IAction } from 'state/action';
import ElementRef from 'components/element/ref';
import Code from 'components/Code';
import InlinedElements from './inlined';
// import 'github-markdown-css';

interface Props {
  id?: string;
  content?: string;
  elements: IElements;
  actions: IAction[];
  language?: string;
  authorIsUser?: boolean;
}

function prepareContent({ id, elements, actions, content, language }: Props) {
  const elementNames = elements.map((e) => e.name);

  // Sort by descending length to avoid matching substrings
  elementNames.sort((a, b) => b.length - a.length);

  const elementRegexp = elementNames.length
    ? new RegExp(`(${elementNames.join('|')})`, 'g')
    : undefined;

  const scopedActions = actions.filter((a) => {
    if (a.forId) {
      return a.forId === id;
    }
    return true;
  });

  let preparedContent = content ? content.trim() : '';
  const inlinedElements: IElements = elements.filter(
    (e) => e.forId === id && e.display === 'inline'
  );
  const refElements: IElements = [];

  if (elementRegexp) {
    preparedContent = preparedContent.replaceAll(elementRegexp, (match) => {
      const element = elements.find((e) => {
        const nameMatch = e.name === match;
        const scopeMatch = e.forId ? e.forId === id : true;
        return nameMatch && scopeMatch;
      });
      const foundElement = !!element;
      const wrongScope = element?.forId && element.forId !== id;
      const inlined = element?.display === 'inline';
      if (!foundElement) {
        // Element reference does not exist, return plain text
        return match;
      }
      if (wrongScope) {
        // If element is not global and not scoped to this message, return plain text
        return match;
      } else if (inlined) {
        // If element is inlined, add it to the list and return plain text
        if (inlinedElements.indexOf(element) === -1) {
          inlinedElements.push(element);
        }
        return match;
      } else {
        // Element is a reference, add it to the list and return link
        refElements.push(element);
        // spaces break markdown links. The address in the link is not used anyway
        return `[${match}](${match.replaceAll(' ', '_')})`;
      }
    });
  }

  if (language) {
    preparedContent = `\`\`\`${language}\n${preparedContent}\n\`\`\``;
  }
  return {
    preparedContent,
    inlinedElements,
    refElements,
    scopedActions
  };
}

export default memo(function MessageContent({
  id,
  content,
  elements,
  actions,
  language,
  authorIsUser,
}: Props) {
  const { preparedContent, inlinedElements, refElements, scopedActions } =
    prepareContent({
      id,
      content,
      language,
      elements,
      actions
    });

  if (!preparedContent) return null;
  // const markdownText = '|sku编码|上架天数|近7天转化率|累计销售（件）|累计销额（万）|\n|:---------------|-----------:|:--------------|-----------------:|-----------------:|\n| P6WYSCFP08D5RV|26|45.0%|100|0.23|\n|P6WYSCFP08D5R2|13|89.0%|54|0.22|\n|P6WYSCFP08D5R3|29|93.0%|89|0.29|';
  // const markdownText = `[点击查看RB7VMN04DD3BT8的补货依据](http://116.63.187.130/test/command/bs01/#/predict?productKey=20190924000186&productCode=P6WYSCFP08D5RV&managingCityNo=-1&regionNo=-1&managingCityName=%E5%85%A8%E5%9B%BD&showType=0 "补货详情")`;
  // const iframeUrl = "http://116.63.187.130/test/command/bs01/#/predict?productKey=20190924000186&productCode=P6WYSCFP08D5RV&managingCityNo=-1&regionNo=-1&managingCityName=%E5%85%A8%E5%9B%BD&showType=0";
  // let index = 1;
  // let timer: NodeJS.Timeout;
 
  // function showText() {
  //   console.log(preparedContent, 234)
  //   preparedContent = preparedContent.slice(0, index)
  //   index++
  //   if (index >= preparedContent.length) {
  //     clearTimeout(timer)
  //   }
  //   timer = setTimeout(() => showText(), 500)
  // }
  // showText()

  return (
    <Stack width="100%">
      <Typography
        sx={{
          width: '100%',
          minHeight: '20px',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          fontFamily: 'Inter',
          fontWeight: authorIsUser ? 500 : 300
        }}
        component="div"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="markdown-body"
          components={{
            a({ children, ...props }) {
              const name = children[0] as string;
              const element = refElements.find((e) => e.name === name);

              if (element) {
                return <ElementRef element={element} />;
              } else {
                const { href } = props
                // 写死判断展示iframe
                if (href?.indexOf('/#/predict') !== -1) {
                  return (
                    <>
                      <Link {...props} target="_blank" className='link-tag'>
                        {children}
                      </Link>
                      <iframe
                        className='link-iframe'
                        src={href}
                      >
                      </iframe>
                    </>
                  );
                } else {
                  return (
                    <Link {...props} target="_blank">
                      {children}
                    </Link>
                  );
                }
              }
            },
            code({ ...props }) {
              return <Code {...props} />;
            },
            tr({ children }) {
              return (
                <Box
                  component='tr'
                  sx={{
                    color: 'text.primary',
                    backgroundColor: (theme) => {
                      console.log(theme, 992)
                      if (theme.palette.mode === 'light') {
                        return '#fff'
                      } else {
                        return theme.palette.background.default
                      }
                    },
                  }}
                >
                  {children}
                </Box>
              )
            },
            th({ children }) {
              return (
                <Box
                  component='th'
                  sx={{
                    border: (theme) => {
                      console.log(theme, 992)
                      if (theme.palette.mode === 'light') {
                        return '1px solid #d0d7de;'
                      } else {
                        return `1px solid ${theme.palette.divider}`
                      }
                    },
                  }}
                >
                  {children}
                </Box>
              )
            },
            td({ children }) {
              return (
                <Box
                  component='td'
                  sx={{
                    border: (theme) => {
                      console.log(theme, 992)
                      if (theme.palette.mode === 'light') {
                        return '1px solid #d0d7de;'
                      } else {
                        return `1px solid ${theme.palette.divider}`
                      }
                    },
                  }}
                >
                  {children}
                </Box>
              )
            },
          }}
        >
          {preparedContent}
        </ReactMarkdown>
      </Typography>
      <InlinedElements elements={inlinedElements} actions={scopedActions} />
    </Stack>
  );
});
