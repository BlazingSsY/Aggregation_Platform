import { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Select,
  Input,
  Button,
  Space,
  Form,
  Tree,
  Progress,
  Tag,
  Alert,
  message,
} from 'antd';
import {
  CodeOutlined,
  DownloadOutlined,
  CopyOutlined,
  ImportOutlined,
  ClearOutlined,
} from '@ant-design/icons';

const treeData = [
  {
    title: 'user-service',
    key: 'root',
    children: [
      {
        title: 'src/main/java/com/example',
        key: 'src',
        children: [
          { title: 'controller/UserController.java', key: 'f1', isLeaf: true },
          { title: 'service/UserService.java', key: 'f2', isLeaf: true },
          { title: 'service/impl/UserServiceImpl.java', key: 'f3', isLeaf: true },
          { title: 'entity/User.java', key: 'f4', isLeaf: true },
          { title: 'mapper/UserMapper.java', key: 'f5', isLeaf: true },
        ],
      },
      { title: 'pom.xml', key: 'pom', isLeaf: true },
      { title: 'README.md', key: 'readme', isLeaf: true },
    ],
  },
];

const SAMPLE: Record<string, string> = {
  f1: `package com.example.controller;

import com.example.entity.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> list() {
        return userService.listAll();
    }

    @PostMapping
    public User create(@Valid @RequestBody User user) {
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        userService.remove(id);
    }
}`,
  f2: `package com.example.service;

import com.example.entity.User;
import java.util.List;

public interface UserService {
    List<User> listAll();
    User create(User user);
    User update(Long id, User user);
    void remove(Long id);
}`,
  f3: `// UserServiceImpl.java - 略，结构包含日志记录、参数校验、异常处理`,
  f4: `// User.java - 实体类，含 id / name / email / createdAt 字段`,
  f5: `// UserMapper.java - MyBatis Plus 映射`,
  pom: `<!-- pom.xml - Spring Boot 3.x 工程基础依赖 -->`,
  readme: `# user-service\n\n基于 Spring Boot 的用户管理服务，提供 CRUD 接口。`,
};

export default function CodeGenPage() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [activeFile, setActiveFile] = useState<string>('f1');
  const [error, setError] = useState<string | null>(null);

  const onGenerate = () => {
    setGenerating(true);
    setProgress(0);
    setDone(false);
    setError(null);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setGenerating(false);
          setDone(true);
          message.success('代码已生成');
          return 100;
        }
        return p + 10;
      });
    }, 220);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bordered={false} title={<><CodeOutlined /> 需求配置</>}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="开发语言">
                <Select
                  defaultValue="java"
                  options={[
                    { value: 'java', label: 'Java' },
                    { value: 'python', label: 'Python' },
                    { value: 'js', label: 'JavaScript / TypeScript' },
                    { value: 'go', label: 'Go' },
                    { value: 'csharp', label: 'C#' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="开发框架">
                <Select
                  defaultValue="springboot"
                  options={[
                    { value: 'springboot', label: 'Spring Boot 3.x' },
                    { value: 'react', label: 'React 18' },
                    { value: 'vue', label: 'Vue 3' },
                    { value: 'fastapi', label: 'FastAPI' },
                    { value: 'gin', label: 'Gin' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="代码规范">
                <Select
                  defaultValue="alibaba"
                  options={[
                    { value: 'alibaba', label: '阿里巴巴 Java 开发手册' },
                    { value: 'google', label: 'Google Style Guide' },
                    { value: 'airbnb', label: 'Airbnb Style Guide' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="需求描述" required>
            <Input.TextArea
              rows={5}
              defaultValue="生成一个用户管理系统的 CRUD 接口，包含参数校验、异常处理、日志记录，使用 MyBatis Plus 操作数据库。"
              placeholder="请详细描述你的代码需求"
            />
          </Form.Item>

          <Space>
            <Button type="primary" size="large" icon={<CodeOutlined />} loading={generating} onClick={onGenerate}>
              生成代码
            </Button>
            <Button icon={<ImportOutlined />}>导入需求文档</Button>
            <Button icon={<ClearOutlined />}>清空</Button>
          </Space>
        </Form>

        {generating && (
          <Progress percent={progress} status="active" style={{ marginTop: 16 }} />
        )}
        {error && <Alert type="error" message={error} showIcon style={{ marginTop: 16 }} />}
      </Card>

      <Card
        bordered={false}
        title={<>代码预览 {done && <Tag color="success">已生成</Tag>}</>}
        extra={
          <Button type="primary" icon={<DownloadOutlined />} disabled={!done}>
            下载全部代码（ZIP）
          </Button>
        }
        bodyStyle={{ padding: 0 }}
      >
        <Row>
          <Col xs={24} md={7} style={{ borderRight: '1px solid #f0f0f0', minHeight: 460 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
              工程目录
            </div>
            <Tree
              defaultExpandAll
              showLine
              treeData={treeData}
              selectedKeys={[activeFile]}
              onSelect={(keys) => keys[0] && setActiveFile(keys[0] as string)}
              style={{ padding: 12 }}
            />
          </Col>
          <Col xs={24} md={17}>
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontFamily: 'monospace', color: '#595959' }}>{activeFile}</span>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard?.writeText(SAMPLE[activeFile] || '');
                  message.success('已复制到剪贴板');
                }}
              >
                复制
              </Button>
            </div>
            <pre
              style={{
                margin: 0,
                padding: 16,
                fontSize: 13,
                lineHeight: 1.7,
                background: '#0f1419',
                color: '#e6e6e6',
                minHeight: 420,
                overflow: 'auto',
                fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
              }}
            >
              {SAMPLE[activeFile] || '// 请选择左侧文件查看代码'}
            </pre>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
