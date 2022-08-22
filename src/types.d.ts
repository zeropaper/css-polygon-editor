export interface Data {
  rows: DataRow[];
  footer: DataFooter;
}

export type DataRow = AssetNode | LiabilityNode;

export interface DataNode<T> {
  id: string;
  name: string;
  state: 'open' | 'closed';
  children?: T[];
}

export interface AssetNode extends DataNode<AssetNode> {
  assets: string;
  assetdelta: string;
}

export interface LiabilityNode extends DataNode<LiabilityNode> {
  liabilities: string;
  liabilitydelta: string;
}

export type DataFooter = [
  { name: string; assets?: string; liabilities?: string },
  { name: string; assets?: string; liabilities?: string }
];

declare module './data-mock.json' {
  export default Data;
}
