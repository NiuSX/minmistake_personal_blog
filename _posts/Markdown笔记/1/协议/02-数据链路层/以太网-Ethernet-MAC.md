# 以太网 Ethernet MAC 学习笔记

最后整理：2026-06-11

以太网是局域网中最常见的数据链路层技术。这里重点关注 MAC 子层：帧格式、MAC 地址、EtherType、交换转发、广播与校验。物理层部分请看 `../01-物理层/以太网物理层-Ethernet-PHY.md`。

## 解决的问题

- 同一局域网中设备如何标识彼此。
- 网络层数据包如何被封装为链路层帧。
- 交换机如何根据 MAC 地址转发。
- 接收方如何判断帧是否损坏。

## 以太网帧结构

| 字段 | 长度 | 作用 |
|---|---:|---|
| Preamble + SFD | 8 字节 | 同步与帧开始标识 |
| Destination MAC | 6 字节 | 目标 MAC 地址 |
| Source MAC | 6 字节 | 源 MAC 地址 |
| EtherType/Length | 2 字节 | 上层协议类型或长度 |
| Payload | 46-1500 字节常见 | 承载 IP、ARP 等数据 |
| FCS | 4 字节 | CRC 校验 |

常见 EtherType：

| EtherType | 协议 |
|---|---|
| `0x0800` | IPv4 |
| `0x0806` | ARP |
| `0x86DD` | IPv6 |
| `0x8100` | 802.1Q VLAN 标签 |

## 交换机转发逻辑

1. 交换机收到帧，记录源 MAC 与入端口的对应关系。
2. 查找目标 MAC 是否在 MAC 地址表中。
3. 如果已知目标端口，就只向该端口转发。
4. 如果未知单播、广播或组播，可能向 VLAN 内多个端口泛洪。
5. MAC 表项会老化，长时间不用会被删除。

## 学习重点

- MAC 地址只在当前二层链路内有意义，跨路由器后二层头会被重新封装。
- 交换机不是根据 IP 转发普通二层帧，而是根据 MAC 表转发。
- 广播域过大时，ARP、DHCP、未知单播泛洪都会影响网络。
- Jumbo Frame 可以提升大流量场景效率，但链路两端和中间设备 MTU 必须一致。

## 抓包观察

Wireshark 过滤：

```text
eth.addr == aa:bb:cc:dd:ee:ff
eth.type == 0x0800
eth.type == 0x0806
```

## 参考资料

- IEEE 802.3 Ethernet Working Group: <https://www.ieee802.org/3/>
- IANA EtherType Numbers: <https://www.iana.org/assignments/ieee-802-numbers/ieee-802-numbers.xhtml>

