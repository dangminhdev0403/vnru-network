# Graph Report - .  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 237 nodes · 244 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b49e13c4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 13
- Community 14
- Community 15

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 13 edges
4. `jest` - 8 edges
5. `include` - 7 edges
6. `AppService` - 7 edges
7. `AppController` - 6 edges
8. `scripts` - 5 edges
9. `exclude` - 5 edges
10. `lib` - 4 edges

## Surprising Connections (you probably didn't know these)
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  services/auth-service/tsconfig.build.json → frontend/tsconfig.json

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest, @nestjs/cli, @nestjs/schematics (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (17): Controller, Get, Injectable, AppController, AppModule, Module, AppService, AccessControlModule (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (20): @dangminhdev04032005/query-resource, dependencies, @dangminhdev04032005/query-resource, next, react, react-dom, @tanstack/react-query, name (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (20): eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, author, dependencies, @nestjs/common (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (15): exclude, include, node_modules, **/*.ts, dist, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (13): js, json, **/*.(t|j)s, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 11 - "Community 11"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **129 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `eslintConfig`, `nextConfig` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 0` to `Community 4`, `Community 6`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 9` to `Community 6`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09475806451612903 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._