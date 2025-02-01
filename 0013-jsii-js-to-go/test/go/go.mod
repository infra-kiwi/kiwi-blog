module github.com/infra-kiwi/kiwi-blog/0013-jsii-js-to-go/test

go 1.23.5

replace kiwi_blog/jsii_js_to_go => ../../dist-jsii/go/jsii_js_to_go

require kiwi_blog/jsii_js_to_go v1.0.0

require (
	github.com/Masterminds/semver/v3 v3.3.1 // indirect
	github.com/aws/jsii-runtime-go v1.106.0 // indirect
)
