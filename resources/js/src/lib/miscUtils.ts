/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import _, { PartialObject, ValueKeyIteratee } from 'lodash';

export function convertBracketToDot(path: string) {
  return path.replace(/\[([0-9]+)\]/g, '.$1');
}

export function pickByDeep<T extends object>(
  data: T,
  predicate: ValueKeyIteratee<T[keyof T]>,
): PartialObject<T> {
  const newData = _.pickBy(data, predicate);
  const cloneData = _.cloneDeep(newData);
  _.forEach(newData, (item, key) => {
    if (typeof item === 'object') {
      _.set(cloneData, key, pickByDeep(item as any, predicate));
    } else if (Array.isArray(item)) {
      item.forEach((arrItem: any, arrKey) => {
        _.set(cloneData, `${key}[${arrKey}]`, pickByDeep(arrItem, predicate));
      });
    }
  });

  return cloneData;
}

/** To test.... */
export function forEachDeep<T extends object>(
  data: T,
  predicate: (v: T[keyof T], k: keyof T, path: string) => void,
  thePath = '',
) {
  _.forEach(data, (value, key) => {
    if (Array.isArray(value) || typeof value === 'object') {
      forEachDeep(data, predicate, `${thePath}.${key}`);
    }

    const pollito = Array.isArray(data)
      ? `${thePath}[${key}]`
      : `${thePath}.${key}`;
    predicate(value, key as keyof T, pollito);
  });
}

export function getNodeType(node: React.ReactNode) {
  // get name from ReactMemo(React.forwardRef), React.forwardRef and plain function or class
  const type = _.get(
    node,
    'type.type.render.name',
    _.get(
      node,
      'type.render.name',
      _.get(node, 'type.name', _.get(node, 'type.type.name', null)),
    ),
  );

  return type as unknown as string;
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function vhToPixels(vh: number) {
  return `${Math.round(window.innerHeight / (100 / vh))}px`;
}

export function recursiveMap(
  children: React.ReactNode,
  fn: (__: React.ReactNode) => React.ReactNode,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children && !_.isFunction(child.props.children)) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props.children, fn),
      } as any);
    }

    return fn(child);
  });
}

export function arrayToRecord(
  arr: string[] | Readonly<string[]>,
  predicate: (item: string) => string,
) {
  const record: Record<string, string> = {};

  arr.forEach((v) => {
    record[v] = predicate(v);
  });

  return record;
}
